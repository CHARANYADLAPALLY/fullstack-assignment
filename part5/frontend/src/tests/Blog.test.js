import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Blog from '../components/Blog';
import { render, fireEvent } from '@testing-library/react';

describe('testing the Blog component', () => {
  let component;
  const updateMockHandler = jest.fn();

  beforeEach(() => {
    const blog = {
      likes: 3,
      title: 'Cool Blog 5',
      author: 'Peter Lustig',
      url: 'https://test.com',
      user: {
        username: 'mluukkai',
        name: 'Matti Luukkaine',
        id: '5f7481f61111ab3dcd0f628b'
      },
      id: '5f7481f61111ab3dcd0f628b'
    };

    component = render(
      <Blog blog={blog} countLikes={updateMockHandler} />
    );
  });

  test('renders the blogs title and author, but does not render its url or number of likes by default', () => {
    const element = component.getByText(
      'Cool Blog 5 by Peter Lustig'
    );
    expect(element).toBeDefined();
  });

  test('check that the blogs url and number of likes are shown when the button controlling the shown details has been clicked', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    expect(component.container).toHaveTextContent('https://test.com');
    expect(component.container).toHaveTextContent('likes');
    expect(component.container).toHaveTextContent('3');
  });

  test('ensure that if the like button is clicked twice, the event handler the component received as props is called twice.', () => {
    fireEvent.click(component.container.querySelector('.toggle-button'));

    const likeButton = component.container.querySelector('.like-button');

    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(updateMockHandler.mock.calls.length).toBe(2);
  });
});