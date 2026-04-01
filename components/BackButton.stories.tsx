import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BackButton from './BackButton';

const meta: Meta<typeof BackButton> = {
  title: 'Components/BackButton',
  component: BackButton,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {};
