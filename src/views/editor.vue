<template>
    <div id = 'container'>
        <div id = 'topBar'>
            <p class = 'title'>{{ title }}</p>
            <ul id = 'filemenu'>
                <template v-for = '( item, index) in menu' :key = 'index'>
                    <li @click = 'toggleMenu(item.name)'>{{ item.name }}
                        <ul v-if = 'activeMenu === item.name'>
                            <li @click = 'stop'  v-for = '( child, index) in item.children' :key = 'index'  >{{ child.name }}</li>
                        </ul>
                    </li>
                </template>
            </ul>

            <FormattingToolbar />
        </div>

        <div id = 'editContainer'>
            <div id = 'page'>
                <div id = 'document' contenteditable = true>
                </div>
                <div id = 'cursorOverlay'>
                    <span :style = '[ cursorPosition(item), randomCursorColor]' class = 'cursor other' v-for = '( item, index) in otherCursors' :key = 'index' ></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FormattingToolbar from '@/components/formattingToolbar.vue';
export default {
    components: { FormattingToolbar },
    methods: {
        randomCursorColor() {
            let counter = 1;
            console.log('CURSOR', counter);
            let chooseRandNo = () => {
                let x  = Math.ceil(Math.random() * (this.cursorColors.length - 1));

                console.log('...... Choosing Random number ......');
                console.log('Candidate: X', x);
                console.log('SELECTED CURSORS', this.selectedCursorColors);
                console.log(!this.selectedCursorColors.includes(x) )
                counter++;
                if(counter >= 10)
                    return x;
                if(this.otherCursors.length > this.cursorColors.length || !this.selectedCursorColors.includes(x) ) {
                    this.selectedCursorColors.push(x);
                    console.log('RETURNING X NOW');
                    return x;
                }
                else return chooseRandNo();
            }
            
            let randomNumber = chooseRandNo();
            console.log('RETURNED RANDOME NUMBER', randomNumber);
            return `border-color: ${ this.cursorColors[randomNumber] }`;
        },
        cursorPosition(coordinates) {
            const xPos = coordinates.x + "em";
            const yPos = coordinates.y + 'em';

            return `top: ${ xPos }; left: ${ yPos };`;
        },
        toggleMenu(name) {
            console.log('TOGGLIGNG MENU', name);
            this.activeMenu = (this.activeMenu === name) ? null : name;
        }
    },

    data() {
        return {
            title: 'New Document',
            activeMenu: null,
            selectedCursorColors: [],
            cursorColors: [
                '#ff0006',
                '#00a7ff',
                'blue',
                '#ff0023',
                'purple'
            ],
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
            menu: [{
                    name: 'File',
                    children: [{
                        name: 'Share'
                    }, {
                        name: 'Download'
                    }, {
                        name: 'Document Details'
                    }, {
                        name: 'Print'
                    }]
                }, {
                    name: 'Edit',
                    children: [{
                        name: 'Copy'
                    }]
                }, {
                    name: 'View',
                    children: [{
                        name: 'Zoom'
                    }]
                }, {
                    name: 'Tools',
                    children: [{
                        name: 'Accessibility Settings'
                    }]
                }, {
                    name: 'Help',
                    children: [{
                        name: 'About'
                    }, {
                        name: 'Shortcuts'
                    }]
                }, {
            } ]
        }
    }
}
</script>

<style scoped src = '@/assets/editor.css'>
</style>
