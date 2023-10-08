export const defaultTests = [
  {
    reference: 'apple',
    parsed: false,
    expected: [
      {
        type: 'ingredient',
        value: 'apple'
      }
    ]
  },
  {
    reference: 'one apple',
    parsed: false,
    expected: [
      {
        type: 'amount',
        value: 'one'
      },
      {
        type: 'ingredient',
        value: 'apple'
      }
    ]
  },
  {
    reference: '1 apple',
    parsed: false,
    expected: [
      {
        type: 'amount',
        value: '1'
      },
      {
        type: 'ingredient',
        value: 'apple'
      }
    ]
  },
  {
    reference: '12 apples',
    parsed: false,
    expected: [
      {
        type: 'amount',
        value: '12'
      },
      {
        type: 'ingredient',
        value: 'apples'
      }
    ]
  }
];
