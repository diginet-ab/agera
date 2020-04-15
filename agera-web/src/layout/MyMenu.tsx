import React, { FC, useState } from "react";
import { useSelector } from 'react-redux'
import { useMediaQuery, Theme } from '@material-ui/core';
import { connect } from "react-redux";
import { useTranslate, DashboardMenuItem, MenuItemLink, getResources, Responsive } from "react-admin";
import { withRouter } from "react-router-dom";
import { translate } from "react-admin";
import DefaultIcon from "@material-ui/icons/ViewList";
import ToolIcon from "@material-ui/icons/Send";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import SubMenu from './SubMenu'
import { AppState } from '../types'
import SettingsIcon from '@material-ui/icons/Settings';
import SystemIcon from '@material-ui/icons/Settings';
import StatusIcon from '@material-ui/icons/Assessment';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import ImageIcon from '@material-ui/icons/Image';
import ActionIcon from '@material-ui/icons/PlayCircleFilled';

type MenuName = 'menuSettings' | 'menuStatus';

interface Props {
    dense: boolean;
    logout: () => void;
    onMenuClick: () => void;
}

const MyMenu: FC<Props> = ({ resources, onMenuClick, logout, hasDashboard, dense }: any) => {
    const [state, setState] = useState({
        menuSettings: false,
        menuStatus: false,
    });
    const translate = useTranslate();
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state: AppState) => state.admin.ui.sidebarOpen);
    useSelector((state: AppState) => state.theme); // force rerender on theme change

    const handleToggle = (menu: MenuName) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };    
    return <div>
        {hasDashboard && <DashboardMenuItem onClick={onMenuClick} />}
        <MenuItemLink
            key={"oqhqeqehqwelh"}
            to="/control"
            primaryText={translate("custom.system")}
            onClick={onMenuClick}
            leftIcon={
                    <PowerIcon />
            }
        />
        <SubMenu
            handleToggle={() => handleToggle('menuSettings')}
            isOpen={state.menuSettings}
            sidebarIsOpen={open}
            name="pos.menu.settings"
            icon={<SettingsIcon />}
            dense={dense}
        >
            <MenuItemLink
                to={`/system`}
                primaryText={translate(`resources.system.name`, {
                    smart_count: 2,
                })}
                leftIcon={<SystemIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            <MenuItemLink
                to={`/products`}
                primaryText={translate(`resources.image.name`, {
                    smart_count: 2,
                })}
                leftIcon={<ImageIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            <MenuItemLink
                to={`/action`}
                primaryText={translate(`resources.action.name`, {
                    smart_count: 2,
                })}
                leftIcon={<ActionIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
        </SubMenu>        
        <SubMenu
            handleToggle={() => handleToggle('menuStatus')}
            isOpen={state.menuStatus}
            sidebarIsOpen={open}
            name="pos.menu.status"
            icon={<StatusIcon />}
            dense={dense}
        >
            <MenuItemLink
                to={`/system`}
                primaryText={translate(`resources.system.name`, {
                    smart_count: 2,
                })}
                leftIcon={<SystemIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            <MenuItemLink
                to={`/actions`}
                primaryText={translate(`resources.action.name`, {
                    smart_count: 2,
                })}
                leftIcon={<ActionIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
        </SubMenu>        
        {resources.map((resource: { name: string | number | undefined; icon: any }) => (
            <MenuItemLink
                key={resource.name}
                to={`/${resource.name}`}
                primaryText={translate("resources." + resource.name + ".name", {smart_count: 2})}
                onClick={onMenuClick}
                leftIcon={
                    resource.icon ? <resource.icon /> : <DefaultIcon />
                }
            />
        ))}
        <MenuItemLink
            to="/setup"
            primaryText={translate("custom.setup")}
            onClick={onMenuClick}
            leftIcon={
                    <SettingsApplicationsIcon />
            }
        />
        <Responsive
            small={logout}
            medium={null} // Pass null to render nothing on larger devices
        />
    </div>
}

const mapStateToProps = (state: any) => ({
    resources: getResources(state),
});

export default withRouter(translate(connect(mapStateToProps)(MyMenu)));
