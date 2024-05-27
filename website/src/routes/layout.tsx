import { Outlet } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/ui/navigation-menu";
import { useMetaMask } from "../hooks/use-metamask";
import { formatAddress } from "../utils";

export default function Layout() {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();
  return (
    <div className="container">
      <NavigationMenu className="w-full max-w-full">
        <NavigationMenuLink href="/">Lending Dapp</NavigationMenuLink>
        <div className="flex-1" />
        <NavigationMenuList>
          <NavigationMenuItem>
            {!hasProvider && (
              <a href="https://metamask.io" target="_blank">
                Install MetaMask
              </a>
            )}
            {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
              <Button disabled={isConnecting} onClick={connectMetaMask}>
                Connect MetaMask
              </Button>
            )}
            {hasProvider && wallet.accounts.length > 0 && (
              <a
                className="text_link tooltip-bottom"
                href={`https://etherscan.io/address/${wallet.accounts[0]}`}
                target="_blank"
                data-tooltip="Open in Block Explorer"
              >
                {formatAddress(wallet.accounts[0])}
              </a>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </div>
  );
}
