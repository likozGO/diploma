import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import AppDrawer from '../AppDrawer';
import StackPanel from './StackPanel';

type BarChild = {
    id: string;
    sort: number;
    child: React.ReactNode;
};

type BarMap = {
    [id: string]: BarChild;
};

export const AppBarContext = React.createContext({
    add: (node: BarChild) => { },
    remove: (id: string) => { }
});

const useStyles = makeStyles(theme => ({
    pageActions: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row-reverse' as any,
        width: '100%'
    }
}))

class ContextHelper {
    children: BarMap = {};
    setChildren: (children: BarMap) => void;

    constructor(setChildren: (children: BarMap) => void) {
        this.setChildren = setChildren;
    }

    add(node: BarChild) {
        this.children = {
            ...this.children,
            [node.id]: node
        };

        this.setChildren(this.children);
    }

    remove(id: string) {
        this.children = { ...this.children };
        delete this.children[id];
        this.setChildren(this.children);
    }
}

const appBarButtonVariants = {
    initial: {
        width: 0,
        opacity: 0
    },
    in: {
        width: 'auto',
        opacity: 1
    },
    out: {
        width: 0,
        opacity: 0
    }
}
export default (props: { children: React.ReactNode }) => {
    const styles = useStyles();
    const [, setBarChildren] = useState<BarMap>({});

    const [context] = useState(new ContextHelper(setBarChildren));

    return <AppBarContext.Provider value={context}>
        <AppBar position="static" color="primary">
            <Toolbar variant="dense">
                <AppDrawer trigger={
                    <IconButton>
                        <Menu />
                    </IconButton>} />
                <Typography color="textPrimary">Diploma Project Web-Agregator</Typography>
                <StackPanel direction="row-reverse"
                    className={styles.pageActions}
                    alignItems='center'
                    variants={appBarButtonVariants}>
                    {Object.values(context.children).sort((a, b) => b.sort - a.sort).map(child => <React.Fragment key={child.id}>
                        {child.child}
                    </React.Fragment>)}
                </StackPanel>
            </Toolbar>
        </AppBar>
        {props.children}
    </AppBarContext.Provider>;
}
