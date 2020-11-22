<template>
    <div id = 'container'>
        <div id = 'topBar'>
            <p class = 'title'>{{ title }}</p>
            <button :disabled = 'loadingDoc !== false' @click = 'save'>Sync</button>
            <button :disabled = 'loadingDoc !== false' @click = 'refresh'>Refresh</button>

            <FileMenu>
            </FileMenu>

            <FormattingToolbar />
        </div>

        <div id = 'editContainer'>
            <div id = 'page'>
                <div id = 'document' contenteditable = true :style = 'documentStyleSettings'
                    @input = 'getDoc'
                    v-html = 'oldDoc'
                    v-focus>
                </div>
                <div id = 'cursorOverlay'>
                    <span :style = '[ cursorPosition(item), randomCursorColor]' class = 'cursor other' v-for = '( item, index) in otherCursors' :key = 'index' ></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { randomizeCursorColors } from '@/components/cursors';
import * as docFn from '@/components/docSaver';

import FormattingToolbar from '@/components/formattingToolbar.vue';
import FileMenu from '@/components/fileMenu.vue';

// import getCursorPos from '@/components/getCursorPosition.js';

export default {
    components: { FormattingToolbar, FileMenu },
    directives: {
        focus: {
            mounted(el) {
                el.focus();
            }
        }
    },

    methods: {
        getCursorPosition() {
            /*
            let textBox = document.getElementById('document');
            let cursorOverlay = document.getElementById('cursorOverlay');
            */

            //let cursorPos = getCursorPos(textBox, cursorOverlay);

        },
        refresh: function() {
            this.loadingDoc = true;

            this.getCursorPosition();

            return docFn.refresh()
            .then(res => {
                this.oldDoc = res

                this.loadingDoc = false;
            });
        },
        getDoc() {
            let innerText = document.getElementById('document').innerHTML;
            console.log('GETTING DOC', innerText);
            this.newDoc = innerText;
        },
        documentStyleSettings() {
            let defaultLineHeight = '--line-height: ' + this.defaultLineHeight + 'em';

            let defaultSettings = defaultLineHeight;

            return defaultSettings;
        },

        save: function () {
            this.getDoc();
            return docFn.syncDoc(this.newDoc);
        },

        randomCursorColor: function () { randomizeCursorColors(this.otherCursors); },

        cursorPosition(coordinates) {
            const xPos = coordinates.x + "em";
            const yPos = coordinates.y + 'em';

            return `top: ${ xPos }; left: ${ yPos };`;
        }
    },

    mounted() {
        this.loadingDoc = true;
        return docFn.refresh()
        .then(res => {
            this.oldDoc = res;
            this.loadingDoc = false;
        });
    },

    data() {
        return {
            title: 'New Document',
            documentLineHeight: '1.3',
            loadingDoc: false,
            oldDoc: '',
            newDoc: '',
            autoRefreshTimer: null,
            otherCursors: [],
        }
    }
}
</script>

<style scoped src = '@/assets/editor.css'>
</style>
