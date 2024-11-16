// src/components/MyComponent.test.tsx
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Pill, { PillProps, PillType } from "./Pill";

const basicPillData: PillType = {
  label: "Test",
  bgcolor: "lime",
};

const basicPill: PillProps = {
  data: [basicPillData],
  itemClassName: "custom-class",
};

const closeSelectPillData: PillType = {
  label: "With icon and close button",
  bgcolor: "#ff0000",
};

const closeSelectPill: PillProps = {
  data: [closeSelectPillData],
  onClose: jest.fn(),
  onSelect: jest.fn(),
};

const roundedIconPillData: PillType = {
  label: "Rounded Icon Pill",
  icon: "🎂",
};

const roundedIconPill: PillProps = {
  data: [roundedIconPillData],
  rounded: true,
};

afterEach(() => {
  cleanup();
});

test("renders one pill", () => {
  render(<Pill {...basicPill} />);
  const element = screen.getByRole("button");
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(basicPillData.label);
  expect(element).toHaveClass("custom-class");
});

test("renders 2 pills", () => {
  render(
    <>
      <Pill {...basicPill} />
      <Pill {...closeSelectPill} />
    </>
  );
  const element1 = screen.getByText(basicPillData.label);
  const element2 = screen.getByText(closeSelectPillData.label);
  expect(element1).toBeInTheDocument();
  expect(element2).toBeInTheDocument();
});

test("renders rounded pill with icon", () => {
  render(<Pill {...roundedIconPill} />);

  const button = screen.getByRole("button");

  expect(button).toContainHTML(
    `<span class="iconContainer">${roundedIconPillData.icon}</span>`
  );

  expect(button).toHaveClass("rounded");
});

test("registers onSelect and onClick", () => {
  render(<Pill {...closeSelectPill} />);
  const element = screen.getByText(closeSelectPillData.label);
  const closeBtn = screen.getByLabelText(`Close ${closeSelectPillData.label}`);

  fireEvent.click(element);
  expect(closeSelectPill.onSelect).toHaveBeenCalledTimes(1);

  fireEvent.click(closeBtn);
  expect(closeSelectPill.onClose).toHaveBeenCalledTimes(1);
});

test("keyboard actions closes a pill onClick", () => {
  render(<Pill {...closeSelectPill} />);
  const closeBtn = screen.getByLabelText(`Close ${closeSelectPillData.label}`);

  closeBtn.focus();
  fireEvent.keyDown(document.activeElement || document.body, {
    key: "Enter",
    code: "Enter",
    charCode: 13,
  });
  fireEvent.keyDown(document.activeElement || document.body, {
    key: " ",
    code: "Space",
    charCode: 32,
  });

  expect(closeSelectPill.onClose).toHaveBeenCalledTimes(3); // 1 time from mouse event + 2 times from keyboard events

  fireEvent.keyDown(document.activeElement || document.body, {
    key: "Escape",
    code: "Escape",
    charCode: 27,
  });
  expect(document.activeElement).toBe(document.body);
});
