import Common from './pages/common';
import Index from './pages/index';

const dispatcher = () => {
  new Common();

  switch (document.body.dataset.pageKey) {
  case 'index':
    new Index();
    break;
  case 'blog':
    break;
  }
};

dispatcher();
