import { render, screen } from '@testing-library/react';
import App from './App';

test('Shows the header line', () => {
  render(<App />);
  const element = screen.getByText(/FinApp/i);
  expect(element).toBeInTheDocument();
});


test('Load env variables correctly', () => {
  render(<App />);
  const element = screen.getByText(/42/i);
  expect(element).toBeInTheDocument();
});
