import { h, app } from 'hyperapp';
import marked from 'marked';
import mousetrap from 'mousetrap';

import './style.css';

const state = {
  source: ''
};

const actions = {
  update: source => state => ({source}),

  save: textarea => (state, actions) => {
    paintFlash(textarea, 'springgreen', .25);
    localStorage.setItem('source', state.source);
  },

  delete: textarea => (state, actions) => {
    localStorage.setItem('source', '');
    localStorage.clear();
    actions.setSourceFromStorage();
    textarea.value = '';

    paintFlash(textarea, 'pink', .25);
  },

  setSourceFromStorage: () => {
    if (localStorage.getItem('source')) {
      return state => ({source: localStorage.getItem('source')});
    } else {
      return state => ({source: ''});
    }
  },

  shortcuts: textarea => (state, actions) => {
    mousetrap.bind(['ctrl+s', 'command+s'], e => {
      actions.save(textarea);
      e.preventDefault();
    });

    mousetrap.bind(['ctrl+q', 'command+q'], e => {
      actions.delete(textarea);
      e.preventDefault();
    });
  }
};

const paintFlash = (element, color, seconds) => {
  element.style.transition = `background-color ${seconds / 2}s ease-in-out`;
  element.style.backgroundColor = color;
  setTimeout(() => {element.style.backgroundColor = ''}, seconds * 1000);
};

const dangerouslySetInnerHTML = html => element => {
  element.innerHTML = html;
};

const compile = source => dangerouslySetInnerHTML(marked(source, {sanitize: true}));

const view = (state, actions) => (
  <div
    className="main"
    oncreate={() => actions.setSourceFromStorage()}
  >
    <div
      className="col editor"
    >
      <textarea
        className="mousetrap"
        placeholder="Write markdown code here!"
        oninput={e => actions.update(e.target.value)}
        oncreate={element => actions.shortcuts(element)}
      >
        {state.source}
      </textarea>
    </div>
    <div
      className="col preview"
      onupdate={compile(state.source)}
      oncreate={compile(state.source)}
    >
    </div>
  </div>
);

window.main = app(state, actions, view, document.getElementById('app'));
