<template>
    <div id = 'container'>
        <div id = 'topBar'>
            <p class = 'title'>{{ title }}</p>
            <FileMenu>
            </FileMenu>
            <FormattingToolbar />
        </div>

        <div id = 'editContainer'>
            <div id = 'page'>
                <div id = 'document' contenteditable = true v-focus >
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
import * as diff from 'diff';
import FormattingToolbar from '@/components/formattingToolbar.vue';
import FileMenu from '@/components/fileMenu.vue';
export default {
    components: { FormattingToolbar, FileMenu },
    directives: {
        focus: {
            mounted(el) {
                el.focus();
            }
        }
    },
    watch: {

    },
    methods: {
        getDoc() {
            var innerText = document.getElementById('document').innerHTML
            this.newDoc = innerText;
            this.docDiff();
        },
        docDiff() {
            let currentDiff = diff.diffWordsWithSpace(this.oldDoc, this.newDoc);
            this.diff = currentDiff;
            console.log('THIS DIFF', currentDiff);
        },
        documentStyleSettings() {
            let defaultLineHeight = '--line-height: ' + this.defaultLineHeight + 'em';

            let defaultSettings = defaultLineHeight;

            return defaultSettings;
        },

        randomCursorColor: () => randomizeCursorColors(this.otherCursors),

        cursorPosition(coordinates) {
            const xPos = coordinates.x + "em";
            const yPos = coordinates.y + 'em';

            return `top: ${ xPos }; left: ${ yPos };`;
        }
    },

    data() {
        return {
            title: 'New Document',
            documentLineHeight: '1.3',
            oldDoc: 'Food is worth 4everyng',
            newDoc: '',
            diff: '',
            otherCursors: [{
                x: 10,
                y: 3
            }, {
                x: 12,
                y: 22
            }, {
                x: 32,
                y: 5
            }],
        }
    }
}
</script>

<style scoped src = '@/assets/editor.css'>
</style>
