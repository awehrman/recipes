import { Container, IngredientWithRelations } from '@prisma/client';
import { v4 } from 'uuid';

import { PROPERTY_ENUMS } from 'constants/ingredient';
import { Group } from 'next/dist/shared/lib/router/utils/route-regex';
import ingredient from 'graphql/inputs/ingredient';

type ContainerWithSortOrder = Container & {
  sortOrder: number | string;
};

type ContainersHash = {
  [key: number | string]: ContainerWithSortOrder;
};

type IngredientHash = {
  [id: string]: IngredientWithRelations;
};

type ViewOptions = 'all' | 'new';
type GroupOptions = 'count' | 'name' | 'property' | 'relationship';

const buildContainersByCount = (
  containersByCount: ContainersHash = {},
  ingHash: IngredientHash = {}
) => {
  const referenceCount = ingHash.count;
  if (referenceCount === 0 || referenceCount === 1 || referenceCount === 2) {
    if (!containersByCount?.[referenceCount]) {
      containersByCount[referenceCount] = {
        id: v4(),
        name: `${referenceCount} Reference${referenceCount === 1 ? '' : 's'}`,
        ingredients: [ingHash],
        sortOrder: referenceCount,
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByCount[referenceCount].ingredients.push(ingHash);
    }
  } else {
    // determine count range
    let floor = Math.floor(referenceCount / 10) * 10;
    let ceil = floor + 9;

    if (referenceCount < 10) {
      floor = 3;
      ceil = 10;
    } else if (referenceCount < 20) {
      floor = 11;
      ceil = 20;
    }
    const range = `${floor} - ${ceil} References`;

    if (!containersByCount?.[range]) {
      containersByCount[range] = {
        id: v4(),
        name: range,
        ingredients: [ingHash],
        sortOrder: floor,
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByCount[range].ingredients.push(ingHash);
    }
  }
};

const buildContainersByName = (
  containersByName: ContainersHash = {},
  ingHash: IngredientHash = {},
  view: ViewOptions = 'all',
  ingredients: IngredientWithRelations = []
) => {
  if (ingredients.length < 300) {
    if (!containersByName?.all) {
      containersByName.all = {
        name: `${view === 'new' ? 'New' : 'All'} Ingredients`,
        ingredients: [ingHash],
        sortOrder: 1,
        id: v4(),
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByName.all.ingredients.push(ingHash);
    }
  } else {
    // separate out by alphanumeric header character
    const char = ingHash.name[0]; // TODO adjust non-alpha starts
    // TODO careful with those damn ligatures too 'ﬁ' (although this might be a parsing concern)

    if (!containersByName?.[char]) {
      containersByName[char] = {
        name: char,
        ingredients: [ingHash],
        sortOrder: char,
        id: v4(),
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByName[char].ingredients.push(ingHash);
    }
  }
};

const buildContainersByProperty = (
  containersByProperty: ContainersHash = {},
  ingHash: IngredientHash = {}
) => {
  if (!ingHash.properties?.length) {
    if (!containersByProperty?.other) {
      containersByProperty.other = {
        name: 'No Properties',
        ingredients: [ingHash],
        sortOrder: PROPERTY_ENUMS.length,
        id: v4(),
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByProperty.other.ingredients.push(ingHash);
    }
  }
  ingHash.properties.map((property: string) => {
    if (property && !containersByProperty?.[property]) {
      containersByProperty[property] = {
        name: property, // TODO capitalize
        ingredients: [ingHash],
        sortOrder: PROPERTY_ENUMS.findIndex(
          (propertyEnum) => propertyEnum === property
        ),
        id: v4(),
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByProperty[property].ingredients.push(ingHash);
    }
  });
};

const buildContainersByRelationship = (
  containersByRelationship: ContainersHash = {},
  ingHash: IngredientHash = {},
  view: ViewOptions = 'all',
  ingredients: IngredientWithRelations = []
) => {
  if (!ingHash?.parent?.id) {
    if (!containersByRelationship?.children) {
      containersByRelationship.children = {
        name: 'Other',
        ingredients: [ingHash],
        sortOrder: 1,
        id: v4(),
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByRelationship.children.ingredients.push(ingHash);
    }
  } else {
    if (!containersByRelationship?.parent) {
      containersByRelationship.parent = {
        name: 'Top Level Ingredients',
        ingredients: [ingHash],
        sortOrder: 0,
        id: v4(),
        count: ingHash.length,
        isExpanded: false
      };
    } else {
      containersByRelationship.parent.ingredients.push(ingHash);
    }
  }
};

type BuildProps = {
  group: GroupOptions;
  view: ViewOptions;
  ingredients: IngredientWithRelations[];
};

export const buildContainers = ({
  group = 'name',
  ingredients = [],
  view = 'all'
}: BuildProps): Container[] => {
  let containers: ContainerWithSortOrder[] = [];
  const containersByCount = {};
  const containersByName = {};
  const containersByProperty = {};
  const containersByRelationship = {};

  ingredients.forEach(
    ({ id, isValidated, parent, name, properties, references = [] }) => {
      const ingHash = {
        id,
        count: references.length,
        parent,
        isValidated: isValidated,
        name,
        properties
      };

      // add to count containers
      if (group === 'count') {
        buildContainersByCount(containersByCount, ingHash);
      }

      // add to name containers
      if (group === 'name') {
        buildContainersByName(containersByName, ingHash, view, ingredients);
      }

      // add to property containers
      if (group === 'property') {
        buildContainersByProperty(containersByProperty, ingHash);
      }

      // add to relationship containers
      if (group === 'relationship') {
        buildContainersByRelationship(containersByRelationship, ingHash);
      }
    }
  );

  switch (group) {
    case 'count':
      containers = Object.values(containersByCount);
      break;
    case 'property':
      containers = Object.values(containersByProperty);
      break;
    case 'relationship':
      containers = Object.values(containersByRelationship);
      break;
    default: // name
      containers = Object.values(containersByName);
      break;
  }

  if (group !== 'name') {
    containers.sort((a, b) => +a.sortOrder - +b.sortOrder);
  } else {
    containers.sort((a, b) => `${a.sortOrder}`.localeCompare(`${b.sortOrder}`));
  }

  const result: Container[] = containers.map(({ name, ingredients }) => ({
    name,
    isExpanded: containers.length < 10,
    id: v4(),
    count: ingredients.length,
    ingredients: ingredients.sort((a, b) => a.name.localeCompare(b.name))
  }));

  return result;
};
