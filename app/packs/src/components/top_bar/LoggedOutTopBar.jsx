import React from "react";
import { useWindowDimensionsHook } from "src/utils/window";
import ThemeContainer, { useTheme } from "src/contexts/ThemeContext";

import { LogoLight, LogoDark, Logo } from "src/components/icons";
import Button from "src/components/design_system/button";
import { Sun, Moon } from "src/components/icons";

export const LoggedOutTopBar = ({}) => {
  const { mobile } = useWindowDimensionsHook();
  const { simpleToggleTheme, mode } = useTheme();

  return (
    <div className="navbar-container">
      <nav className={`navbar d-flex justify-content-between`}>
        <div className="d-flex align-items-center" style={{ height: 34 }}>
          {mobile ? (
            <Logo />
          ) : (
            <a href="/" className="mr-6" style={{ height: 30 }}>
              {mode() == "light" ? <LogoLight width={128} height={20} /> : <LogoDark width={128} height={20} />}
            </a>
          )}
        </div>
        <div className="d-flex" style={{ height: 34 }}>
          <Button text="Sign up" type="primary-default" onClick={() => (window.location.href = "/join")} />
          <Button type="white-subtle" onClick={() => (window.location.href = "/")} className="ml-2" text="Sign in" />
          <Button type="white-subtle" size="icon" onClick={simpleToggleTheme} className="text-black ml-2">
            {mode() === "light" ? <Moon color="currentColor" /> : <Sun color="currentColor" />}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <LoggedOutTopBar {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
