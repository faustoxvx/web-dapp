import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import Button from "src/components/design_system/button";
import { P2 } from "src/components/design_system/typography";

import { User, Settings, SignOut, Sun, Moon } from "src/components/icons";

const UserMenu = ({ user, toggleTheme, mode, onClickTransak, signOut }) => {
  const onClickInvites = () => {
    window.location.href = "/quests?tab=talent";
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="talent-button white-subtle-button normal-size-button p-2 no-caret d-flex align-items-center text-primary-03 mr-2"
        id="user-dropdown"
        bsPrefix=""
        as="div"
      >
        <TalentProfilePicture src={user.profilePictureUrl} height={20} userId={user.id} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-menu-dropdown">
        <Dropdown.Item
          key="tab-dropdown-my-profile"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href={`/u/${user.username}`}
        >
          <User pathClassName="icon-dropdown-item" />
          <P2 bold text="My profile" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-settings"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href={`/u/${user.username}/account_settings`}
        >
          <Settings pathClassName="icon-dropdown-item" />
          <P2 bold text="Settings" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Divider className="menu-divider mx-2 my-2" />
        <Dropdown.Item
          key="tab-dropdown-theme"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          onClick={toggleTheme}
        >
          {mode == "light" ? (
            <Moon pathClassName="icon-dropdown-item" color="currentColor" />
          ) : (
            <Sun pathClassName="icon-dropdown-item" color="currentColor" />
          )}
          <P2 bold text={`Dark Theme: ${mode === "light" ? "Off" : "On"}`} className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Divider className="menu-divider mx-2 my-2" />
        <Dropdown.Item
          key="tab-dropdown-sign-out"
          onClick={signOut}
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
        >
          <SignOut pathClassName="icon-dropdown-item" />
          <P2 bold text="Sign out" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Divider className="menu-divider mx-2 mt-2 mb-3" />
        <Button onClick={onClickInvites} type="primary-default" size="big" className="w-100 mb-2">
          <P2 bold text="Invites" className="bg-01" />
        </Button>
        <Button onClick={onClickTransak} type="primary-outline" size="big" className="w-100 mb-2">
          <P2 bold text="Get funds" className="current-color" />
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserMenu;
