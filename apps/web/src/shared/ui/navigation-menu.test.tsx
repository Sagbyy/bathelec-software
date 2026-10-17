import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';

function renderMenu(viewport?: boolean) {
  return render(
    <NavigationMenu viewport={viewport} aria-label="Menu principal">
      <NavigationMenuList>
        <NavigationMenuItem data-testid="admin-item">
          <NavigationMenuTrigger>Administration</NavigationMenuTrigger>
          <NavigationMenuContent>
            <p>Gestion des utilisateurs</p>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

async function openAdministration() {
  await userEvent.click(screen.getByRole('button', { name: /Administration/ }));
  return screen.findByText('Gestion des utilisateurs');
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('NavigationMenu', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the submenu under its own item when the viewport is disabled', async () => {
    renderMenu(false);

    const content = await openAdministration();

    expect(screen.getByTestId('admin-item')).toContainElement(content);
    expect(screen.getByTestId('admin-item')).toHaveClass('relative');
    expect(screen.getByRole('navigation')).toHaveAttribute(
      'data-viewport',
      'false'
    );
  });

  it('renders the submenu inside the shared viewport by default', async () => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    renderMenu();

    const content = await openAdministration();

    expect(screen.getByTestId('admin-item')).not.toContainElement(content);
    expect(screen.getByRole('navigation')).toHaveAttribute(
      'data-viewport',
      'true'
    );
  });
});
