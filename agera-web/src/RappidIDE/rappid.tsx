import React, { FC, useState, useEffect } from 'react';

import {StencilService} from './services/stencil-service';
import {ToolbarService} from './services/toolbar-service';
import {InspectorService} from './services/inspector-service';
import {HaloService} from './services/halo-service';
import {KeyboardService} from './services/keyboard-service';
import RappidService from './services/kitchensink-service';

interface Props {
    form: string
    onFormChange: (newForm: string) => void
}

interface State {
}

export const Rappid: FC<Props> = (props: Props) => {

    let [rappid, setRappid] = useState(null as RappidService | null)

    useEffect(() => {
        let r = new RappidService(props.form,
            props.onFormChange,
            document.getElementById('rappidEl')!,
            new StencilService(),
            new ToolbarService(),
            new InspectorService(),
            new HaloService(),
            new KeyboardService()
        );
        r.startRappid();
        setRappid(r)

    }, [])

    return (
        <div id="rappidEl" className="joint-app joint-theme-modern" style={{ height: "50vh"}}>
            <div className="app-header">
                <div className="app-title">
                    <h1>Edit form</h1>
                </div>
                <div className="toolbar-container"/>
            </div>
            <div className="app-body">
                <div className="stencil-container"/>
                <div className="paper-container"/>
                <div className="inspector-container"/>
                <div className="navigator-container"/>
            </div>
        </div>
    );
}
