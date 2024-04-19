// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { Autosuggest, AttributeEditor } from '@cloudscape-design/components';
import validateField from '../form-validation-config';

const validateHeader = (key, value, messageValue) => {
  const { errorText } = validateField('customHeaders', value, messageValue);

  const errorAttribute = key + 'Error';
  return { [errorAttribute]: errorText };
};

export default function HeadersEditor({ validation = false, refs, data, setData }) {
  const { customHeaders: items } = data;

  const definitions = [
    {
      label: 'Custom header name',
      control: (item, index) => {
        return (
          <Autosuggest
            placeholder="Enter name"
            clearAriaLabel="Clear"
            empty="No names found"
            onChange={onChange('key', item, index)}
            onBlur={() => onBlur('key', item, index)}
            value={item.key || ''}
            options={[{ value: 'Header-Name-1' }, { value: 'Header-Name-2' }, { value: 'Header-Name-3' }]}
            enteredTextLabel={value => `Use: "${value}"`}
            ariaRequired={true}
          />
        );
      },
      errorText: ({ keyError }) => keyError,
    },
    {
      label: 'Custom header value',
      control: (item, index) => {
        return (
          <Autosuggest
            placeholder="Enter value"
            clearAriaLabel="Clear"
            empty="No values found"
            value={item.value || ''}
            onChange={onChange('value', item, index)}
            onBlur={() => onBlur('value', item, index)}
            options={[{ value: 'Value-1' }, { value: 'Value-2' }, { value: 'Value-3' }]}
            enteredTextLabel={value => `Use: "${value}"`}
            ariaRequired={true}
          />
        );
      },
      errorText: ({ valueError }) => valueError,
    },
  ];

  const onAddHeader = () => setData({ ...data, customHeaders: [...items, {}] });

  const onRemoveHeader = ({ detail: { itemIndex } }) => {
    const itemsCopy = items.slice();
    itemsCopy.splice(itemIndex, 1);
    setData({ ...data, customHeaders: itemsCopy });
  };

  const onChange = (key, item, index) => {
    return ({ detail }) => {
      let updateObj = { [key]: detail.value };

      if (validation && item[key + 'Error']) {
        const validationTexts = validateHeader(key, detail.value, key === 'key' ? 'name' : key);
        updateObj = { ...updateObj, ...validationTexts };
      }

      updateItem(updateObj, item, index);
    };
  };

  const onBlur = (key, item, index) => {
    if (!validation) {
      return;
    }

    const value = item[key];
    const validationTexts = validateHeader(key, value, key === 'key' ? 'name' : key);
    updateItem(validationTexts, item, index);
  };

  const updateItem = (update, item = {}, index) => {
    const itemsCopy = items.slice();
    const updatedItem = { ...item, ...update };
    itemsCopy.splice(index, 1, updatedItem);
    setData({ ...data, customHeaders: itemsCopy });
  };

  return (
    <AttributeEditor
      removeButtonText="Remove"
      addButtonText="Add new header"
      empty="No headers associated with the resource."
      definition={definitions}
      onAddButtonClick={onAddHeader}
      onRemoveButtonClick={onRemoveHeader}
      items={items}
      ref={refs?.customHeaders}
    />
  );
}
