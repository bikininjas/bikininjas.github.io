/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextWithHighlight from '../../components/TextWithHighlight';

describe('TextWithHighlight Component', () => {
  const defaultProps = {
    text: 'This is a test text with highlight word',
    highlight: 'highlight',
    className: 'custom-class',
    highlightClass: 'custom-highlight'
  };

  test('renders text without highlight when no match', () => {
    render(
      <TextWithHighlight
        {...defaultProps}
        highlight="nomatch"
      />
    );

    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
  });

  test('highlights matching text correctly', async () => {
    const onHighlight = jest.fn();
    render(
      <TextWithHighlight
        {...defaultProps}
        onHighlight={onHighlight}
      />
    );

    await waitFor(() => {
      const mark = screen.getByRole('mark');
      expect(mark).toHaveClass('custom-highlight');
      expect(mark).toHaveAttribute('aria-label', 'Highlighted text: highlight');
      expect(onHighlight).toHaveBeenCalledWith(1);
    });
  });

  test('handles case-insensitive matches', async () => {
    render(
      <TextWithHighlight
        {...defaultProps}
        text="Test HIGHLIGHT highlight Highlight"
        highlight="highlight"
      />
    );

    await waitFor(() => {
      const marks = screen.getAllByRole('mark');
      expect(marks).toHaveLength(3);
      marks.forEach(mark => {
        expect(mark).toHaveClass('custom-highlight');
      });
    });
  });

  test('applies custom class names', async () => {
    render(<TextWithHighlight {...defaultProps} />);

    await waitFor(() => {
      const container = screen.getByRole('text');
      expect(container).toHaveClass('text-with-highlight', 'custom-class');
    });
  });

  test('sets aria-busy while processing', () => {
    render(<TextWithHighlight {...defaultProps} />);
    const container = screen.getByRole('text');
    expect(container).toHaveAttribute('aria-busy', 'true');
  });

  test('handles empty highlight gracefully', () => {
    render(
      <TextWithHighlight
        {...defaultProps}
        highlight=""
      />
    );

    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
  });

  test('handles error cases gracefully', async () => {
    const invalidRegexHighlight = '[';
    const onHighlight = jest.fn();
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TextWithHighlight
        {...defaultProps}
        highlight={invalidRegexHighlight}
        onHighlight={onHighlight}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
      expect(onHighlight).toHaveBeenCalledWith(0);
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  test('updates highlights when text changes', async () => {
    const { rerender } = render(<TextWithHighlight {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('mark')).toBeInTheDocument();
    });

    rerender(
      <TextWithHighlight
        {...defaultProps}
        text="Different text with highlight word"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('mark')).toBeInTheDocument();
    });
  });

  test('removes highlights when highlight prop is removed', async () => {
    const { rerender } = render(<TextWithHighlight {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('mark')).toBeInTheDocument();
    });

    rerender(
      <TextWithHighlight
        {...defaultProps}
        highlight=""
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('mark')).not.toBeInTheDocument();
    });
  });

  test('renders within error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <TextWithHighlight {...defaultProps}>
        <ErrorComponent />
      </TextWithHighlight>
    );

    expect(screen.getByRole('text')).toBeInTheDocument();
  });
});