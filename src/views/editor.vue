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
                this.showOpenDialog = true;
            }
        },
        getCursorPosition() {
            /*
            let textBox = document.getElementById('document');
            let cursorOverlay = document.getElementById('cursorOverlay');
            */

            //let cursorPos = getCursorPos(textBox, cursorOverlay);

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

        save: function () {
            this.getDoc();
            this.loadingDoc = true;
            return docFn.syncDoc(this.newDoc)
            .then(res => {
                this.oldDoc = res;
                this.loadingDoc = false;
            }).catch(err => {
                this.err = true;
                this.errToast = err.message;
            });
        },

        randomCursorColor: function () { randomizeCursorColors(this.otherCursors); },

        cursorPosition(coordinates) {
            const xPos = coordinates.x + "em";
            const yPos = coordinates.y + 'em';

            return `top: ${ xPos }; left: ${ yPos };`;
        }
    },

    mounted() {
        // Load document
        let doc = this.$store.state.document;

        let id = this.setDocID();

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
            this.loadingDoc = false;
            this.loading = false;
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
