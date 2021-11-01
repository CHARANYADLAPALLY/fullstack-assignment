import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from '../components/BlogForm';
import { render, fireEvent } from '@testing-library/react';

describe('testing the BlogForm component', () => {
  test('check, that the form calls the event handler it received as props with the right details when a new blog is created.', () => {
    const { container } = render(<BlogForm />);

    const title = container.querySelector('#title');
    const author = container.querySelector('#author');
    const url = container.querySelector('#url');

    fireEvent.change(title, {
      target: { value: 'Cool Post 5' }
    });

    fireEvent.change(author, {
      target: { value: 'Peter Lustig' }
    });

    fireEvent.change(url, {
      target: { value: 'https://test.com' }
    });

    expect(title.value).toBe('Cool Post 5');
    expect(author.value).toBe('Peter Lustig');
    expect(url.value).toBe('https://test.com');
  });
});