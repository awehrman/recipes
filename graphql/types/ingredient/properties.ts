import { enumType } from 'nexus';

export const Properties = enumType({
  name: 'Properties',
  members: ['MEAT', 'POULTRY', 'FISH', 'DAIRY', 'SOY', 'GLUTEN']
});
