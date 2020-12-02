<template>
    <div id = 'container'>
        <div id = 'err' v-if = 'err'>
            {{ errToast }}
        </div>

        <div id = 'topBar'>
            <div class = 'row'>
                <router-link class = 'button' to = '/'>Home</router-link>
                <slot name = 'logoutButton'></slot>
                <p v-if = 'editTitle === false' @click = 'editTitle = true' class = 'text-center title'>{{ title || 'Untitled Document' }}</p>
                <input v-else v-on:keyup.enter = 'editTitle = false' type = 'text' placeholder = 'Untitled Document' v-model = 'title' />

                <button :disabled = 'loadingDoc !== false' @click = 'sync'>Sync</button>
            </div>

            <FileMenu @menu = 'menuAction($event)' >
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

        <OpenFileDialog v-if = 'showOpenDialog'>
        </OpenFileDialog>

        <div class = 'loading' id = 'overlay' v-if = 'loading'>
            <p>{{ loadingText }}</p>
        </div>
    </div>
</template>

<script>
import { randomizeCursorColors } from '@/components/cursors';
import * as docFn from '@/components/docGeneral';

import FormattingToolbar from '@/components/formattingToolbar.vue';
import FileMenu from '@/components/fileMenu.vue';

import OpenFileDialog from '@/components/openFileDialog.vue';

// import getCursorPos from '@/components/getCursorPosition.js';

export default {
    components: { FormattingToolbar, FileMenu,
        OpenFileDialog
    },
    directives: {
        focus: {
            mounted(el) {
                el.focus();
            }
        }
    },

    watch: {
        loading: function(val) {
            this.loadingText = 'Loading';
            let counter = 0;
            let loadingTimer = setInterval(() => {
                if(counter > 3) {
                    this.loadingText = 'Loading';
                    counter = 0;
                }
                else
                    this.loadingText += '.';
                counter++;
            },1000)

            if(val === true) {
            } else 
                clearInterval(loadingTimer);
        }
    },

    methods: {
        setDocID() {
            // Check url
            let id = this.$route.params.docID

            this.$store.state.docID = id;

            window.localStorage.setItem('docID', id);

            return id;
        },
        menuAction(payload) {
            console.log('menu action', payload);

            if(payload == 'open') {
                this.stopAutosave();
                this.showOpenDialog = true;
            } else if(payload == 'download'){
                // Todo
            }
        },

        moveCursortoPos(docRange) {
            let docArea = document.getElementById('document');

            // let selection;

            console.log('DOC RANGE TO USE', docRange);

            let restoreSelection = function(containerEl, savedSel) {
                var charIndex = 0, range = document.createRange();
                range.setStart(containerEl, 0);
                range.collapse(true);
                var nodeStack = [containerEl], node, foundStart = false, stop = false;

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType == 3) {
                        var nextCharIndex = charIndex + node.length;
                        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                            range.setStart(node, savedSel.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                            range.setEnd(node, savedSel.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        var i = node.childNodes.length;
                        while (i--) {
                            nodeStack.push(node.childNodes[i]);
                        }
                    }
                }

                var sel = window.getSelection();
                sel.removeAllRanges();
                console.log('RANGE', range);

                sel.addRange(range);
            }

            restoreSelection(docArea, docRange);

            /*
            if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
            {

                let range = document.createRange();
                console.log('NEW RANGE', range);
                docRange.collapse();//collapse the range to the end point. false means collapse to end rather than the start
                selection = window.getSelection();//get the selection object (allows you to change selection)
                console.error('SELECTION', selection);
                let clone = range.cloneRange(docRange)
                console.log('CLONE RANGE', clone);
                console.log('RANGE after clone', range);
                // selection.removeAllRanges();//remove any selections already made
                // selection.addRange(clone);//make the range you have just created the visible selection
            }
            else if(document.selection)//IE 8 and lower
            {
                console.log('SELECTION', document.selection)
                docRange.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                docRange.select();//Select the range (make it the visible selection
            }
            */
        },

        getCursorPosition() {
            let docArea = document.getElementById('document');
            let preCaretRange;

            let saveSelection = function(containerEl) {
                var range = window.getSelection().getRangeAt(0);
                var preSelectionRange = range.cloneRange();
                preSelectionRange.selectNodeContents(containerEl);
                preSelectionRange.setEnd(range.startContainer, range.startOffset);
                var start = preSelectionRange.toString().length;

                return {
                    start: start,
                    end: start + range.toString().length
                }
            }

            return saveSelection(docArea);
            /*

            if (typeof window.getSelection != "undefined") {
                let range = window.getSelection().getRangeAt(0);
                preCaretRange = range.cloneRange();

                preCaretRange.selectNodeContents(docArea);

                preCaretRange.setEnd(range.endContainer, range.endOffset);
                console.log('PRE CARET TEXT AT SET END', preCaretRange.toString());
            } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
                var textRange = document.selection.createRange();
                var preCaretTextRange = document.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
            }
            return preCaretRange;
            */
        },

        getDoc() {
            let innerText = document.getElementById('document').innerHTML;
            this.newDoc = innerText;
        },
        documentStyleSettings() {
            let defaultLineHeight = '--line-height: ' + this.defaultLineHeight + 'em';

            let defaultSettings = defaultLineHeight;

            return defaultSettings;
        },

        sync: function () {
            let startSync = new Date();
            this.getDoc();
            this.loadingDoc = true;
            let beforeSync = this.newDoc;

            return docFn.saveDocument(this.newDoc)
            .then( res => {
                this.getDoc();

                let pos = this.getCursorPosition();
                console.log('POS', pos);
                const { start, end } = pos;
                console.error( 'IN SAVE', { start, end } );
                this.moveCursortoPos(pos );
                return docFn.refreshDoc(this.newDoc)
            })
            .then(res => {
                let pos = this.getCursorPosition();
                this.oldDoc = res;
                this.loadingDoc = false;

                const { start, end } = pos;
                console.error( 'IN REFRESH', { start, end } );

                this.moveCursortoPos( pos );
            }).catch(err => {
                this.err = true;
                this.errToast = err.message;
                throw err;
            });
        },

        randomCursorColor: function () { randomizeCursorColors(this.otherCursors); },

        cursorPosition(coordinates) {
            const xPos = coordinates.x + "em";
            const yPos = coordinates.y + 'em';

            return `top: ${ xPos }; left: ${ yPos };`;
        },

        startAutosave() {
            this.autosaveTimer = setInterval(() => {
                // AutoSave
                return this.sync();
            }, 10000);

            window.localStorage.setItem('autosaveTimer', this.autosaveTimer);
        },

        stopAutosave() {
            clearInterval(this.autosaveTimer);
            let storedTimer = window.localStorage.getItem('autosaveTimer');
            if(storedTimer) {
                window.localStorage.removeItem('autosaveTimer');
                clearInterval(storedTimer);
            }
        }
    },

    beforeRouteLeave() {
        this.stopAutosave();
    },

    beforeUpdate() {
        this.stopAutosave();
    },
    updated() {
        this.startAutosave();
    },

    beforeDestroy() {
        console.log('******************************\nDESTROYING EDITOR\n**************************');
        this.stopAutosave();
    },
    destroy() {
        console.log('******************************\nDESTROYED EDITOR\n**************************');
        this.stopAutosave();
    },
    mounted() {
        // Load document
        let doc = this.$store.state.document;

        let id = this.setDocID();

        this.stopAutosave();
        this.startAutosave();

        if(!doc) {
            let docList = window.localStorage.getItem('docList');
            docList  = JSON.parse(docList);

            if(docList[id])
                doc = docList[id];
            else {
                console.log('document not found');
                return this.$router.push('/');
            }
        }


        this.loading = true;
        this.loadingDoc = true;
        return docFn.initialize(doc, id)
        .then(res => {
            this.oldDoc = res;
            console.log('VUE EDITOR OLD DOC', this.oldDoc);
            this.loadingDoc = false;
            this.loading = false;
        })
        .catch(err => {
            this.err = true;
            console.log('THROWING EROR', this.err);
            this.errToast = 'Error loading document';
        });
    },

    data() {
        return {
            showOpenDialog: false,

            title: '',
            editTitle: false,

            documentLineHeight: '1.3',
            loadingDoc: false,
            loading: false,
            oldDoc: '',
            newDoc: '',
            autoRefreshTimer: null,
            otherCursors: [],

            err: false,
            errToast: 'Big bad error!',

            loadingText: 'Loading'
        }
    }
}
</script>

<style scoped src = '@/assets/editor.css'>
</style>
