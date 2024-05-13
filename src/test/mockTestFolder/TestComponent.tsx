export type TestComponentProps = {
  displayName: string;
};

const TestComponent = ({ displayName }: TestComponentProps) => {
  return displayName;
};

export default TestComponent;
