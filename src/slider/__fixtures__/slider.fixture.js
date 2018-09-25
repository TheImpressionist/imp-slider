
import Slider from '../';

const fixtures = [
  {
    component: Slider,
    name: 'Slider with defaults',
    props: {
      position: 0,
    },
  },
  {
    component: Slider,
    name: 'Slider with .1 step',
    props: {
      position: 0,
      step: 0.1,
    },
  },
  {
    component: Slider,
    name: 'Slider 0 to 1 with .1 step',
    props: {
      min: 0,
      max: 1,
      step: 0.1,
    },
  },
  {
    component: Slider,
    name: 'Slider with custom default value',
    props: {
      min: 0,
      max: 10,
      defaultValue: 1,
    },
  },
  {
    component: Slider,
    name: 'Slider with basic points',
    props: {
      points: [0, 5, 10],
    },
  },
  {
    component: Slider,
    name: 'Slider with custom string points',
    props: {
      points: [
        {
          key: 0,
          value: 'Hi!',
        }, {
          key: 5,
          value: 'Hello!',
        },
        {
          key: 10,
          value: 'Stuff',
        },
      ],
    },
  },
  {
    component: Slider,
    name: 'Slider jump between points',
    props: {
      jump: true,
      points: [0, 1, 2, 5, 7, 10],
    },
  },
  {
    component: Slider,
    name: 'Disabled slider',
    props: {
      value: 50,
      min: 0,
      max: 100,
      disabled: true,
    },
  }
];

export default fixtures;
