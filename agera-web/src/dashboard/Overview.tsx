
import React, { useState, useEffect, useRef } from 'react'
//import * as joint from 'jointjs'
import * as joint from 'rappid'

interface Props { 
    form: string
    text: string
}

export const Overview: React.FC<Props> = (props) => {
    useEffect(() => {
        let graph = new joint.dia.Graph;
        let paper = new joint.dia.Paper({
            el: document.getElementById('divOverview'),
            model: graph,
            width: '100%',
            height: '50vh',
            gridSize: 10,
            drawGrid: true,
            background: {
                color: 'rgba(0, 255, 0, 0.3)'
            },
            //interactive: (cellView) => false //(cellView instanceof joint.dia.ToolView)
        });

        let rect = new joint.shapes.standard.Rectangle();
        rect.position(100, 30);
        rect.resize(100, 40);
        rect.attr({
            body: {
                fill: 'lightgray',
            },
            label: {
                text: props.text,
                fill: 'gray'
            },
        });
        rect.attr('body/strokeWidth', 0.5);
        rect.attr('label/text', 'Box1');
        rect.addTo(graph);

        let rect2 = rect.clone();
        (rect2 as any).translate(300, 0);
        rect2.attr('label/text', 'Box2');
        rect2.attr('body/strokeWidth', 0.5);
        rect2.addTo(graph);

        let link = new joint.shapes.standard.Link();
        link.source(rect);
        link.target(rect2);
        link.attr('width', 0.5);
        link.router('metro')
        link.addTo(graph);

        let textBlock = new joint.shapes.standard.TextBlock();
        textBlock.resize(100, 100);
        textBlock.position(50, 100);
        textBlock.attr('root/title', 'joint.shapes.standard.TextBlock');
        textBlock.attr('body/fill', 'transparent');
        textBlock.attr('label/text', 'text');
        // Styling of the label via `style` presentation attribute (i.e. CSS).
        textBlock.attr('label/style/color', 'red');
        textBlock.attr('body/strokeWidth', 0);
        textBlock.addTo(graph);
    }, [])
    return <div id="divOverview">Overview</div>
}