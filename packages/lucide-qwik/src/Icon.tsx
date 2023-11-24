import { component$, Slot, Fragment } from '@builder.io/qwik';
import defaultAttributes from './defaultAttributes';
import { IconNode, LucideProps } from './types';

/**
 * Converts string to KebabCase
 * Copied from scripts/helper. If anyone knows how to properly import it here
 * then please fix it.
 *
 * @param {string} string
 * @returns {string} A kebabized string
 */

export const toKebabCase = (string: string) => string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

interface IconProps {
  name: string
  iconNode: IconNode
}

const Icon = component$((props: LucideProps & IconProps) => {
  const {
    name,
    size,
    color,
    absoluteStrokeWidth,
    strokeWidth,
    class: classProp,
    iconNode,
    ...rest
  } = props;
  return (
    <svg
      {...defaultAttributes}
      width={size ?? defaultAttributes.width}
			height={size ?? defaultAttributes.height}
			stroke={color ?? defaultAttributes.stroke}
			stroke-width={
        absoluteStrokeWidth
        ? Number(strokeWidth ?? defaultAttributes['stroke-width']) * 24 / (Number(size))
        : Number(strokeWidth ?? defaultAttributes['stroke-width'])
      }
      class={`lucide lucide-${toKebabCase(name ?? 'icon')} ${
        classProp != null ? classProp : ''
      }`}
      {...rest}
    >
      {...iconNode.map(([Dynamic, attrs], key) => <Fragment key={key}><Dynamic {...attrs}></Dynamic></Fragment>)}
      <Slot/>
    </svg>
  )
});

export default Icon;
