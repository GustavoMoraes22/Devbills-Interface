import { MagnifyingGlass } from '@phosphor-icons/react';
import { ComponentProps, forwardRef } from 'react';

import { Container } from './style';

type ButtonIconProps = ComponentProps<'button'>;

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  function ({ ...props }, ref) {
    return (
      <Container ref={ref} {...props}>
        <MagnifyingGlass />
      </Container>
    );
  },
);
