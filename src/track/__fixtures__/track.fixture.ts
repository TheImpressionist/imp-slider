
import SLIDER_TRACK from '../';

const fixtures = [
  {
    component: SLIDER_TRACK,
    name: 'Track 0% Position',
    props: {
      position: 0,
    },
  },
  {
    component: SLIDER_TRACK,
    name: 'Track x% Position',
    props: {
      position: 57,
    },
  },
  {
    component: SLIDER_TRACK,
    name: 'Track disabled',
    props: {
      position: 57,
      disabled: true,
    },
  }
];

export default fixtures;
