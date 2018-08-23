// ----------------------------------------------------------------------
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// --
// Copyright 2018 Andi Dittrich <https://andidittrich.de>
// ----------------------------------------------------------------------

import {Blocks} from '../../wp';

// block element transformation/converting
export default {
    from: [

        // allow transform from RAW DOM <pre><code> (legacy syntax highlighting)
        // higher priority then 'core/preformatted'
        // automatically applied when transforming from legacy to blocks
        {
            type: 'raw',
            priority: 4,
            isMatch: function(node){
                return  node.nodeName === 'PRE' &&
                        node.children.length === 1 &&
                        node.firstChild.nodeName === 'CODE'
            },
            transform: function (node){
                // use inner text as content
                return Blocks.createBlock('enlighter/codeblock', {content: node.textContent});
            },
        },

        // allow transform from standard EnlighterJS code to blocks
        // higher priority then 'core/preformatted'
        // automatically applied when transforming from legacy to blocks
        // @BUG https://github.com/WordPress/gutenberg/issues/8648
        // @TODO re-enable transform and use attribute matching
        /*
        {
            type: 'raw',
            priority: 4,
            isMatch: function(node){
                return  false;
            },
            transform: function (node){
                // use inner text as content
                return _wp.blocks.createBlock('enlighter/codeblock', {content: node.textContent});
            },
        },
        */

        // allow transform from core/code block
        // allow transform from core/preformatted block
        // allow transform from core/paragraph block
        // @TODO remove content formattings (convert to text!)
        {
            type: 'block',
            blocks: ['core/code', 'core/preformatted', 'core/paragraph'],
            transform: function ({content}) {
                return Blocks.createBlock('enlighter/codeblock', {content});
            },
        }
    ],

    to: [
        // allow transform to core/code block
        {
            type: 'block',
            blocks: ['core/code'],
            transform: function ({content}) {
                return Blocks.createBlock('core/code', {content});
            },
        },

        // allow transform to core/preformatted block
        {
            type: 'block',
            blocks: ['core/preformatted'],
            transform: function ({content}) {
                return Blocks.createBlock('core/preformatted', {content});
            },
        }
    ]
}