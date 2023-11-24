export default ({ componentName, children }) => `
import Icon from '../Icon';
import type { IconNode, LucideProps } from '../types';

const iconNode: IconNode = ${JSON.stringify(children)};

const component = (props: LucideProps) => (
  <Icon {...props} name="${componentName}" iconNode={iconNode} />
)

export { component as default };
`;
