<template>
    <ul id = 'filemenu'>
        <template v-for = '( item, index) in menu' :key = 'index'>
            <li @click = 'toggleMenu(item.name)'>{{ item.name }}
                <ul v-if = 'activeMenu === item.name'>
                    <li @click = 'stop'  v-for = '( child, index) in item.children' :key = 'index'  >{{ child.name }}</li>
                </ul>
            </li>
        </template>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            activeMenu: null,
            menu: [{
                name: 'File',
                children: [{
                    name: 'Recent Documents',
                    children: [{
                        name: 'Doc 1'
                    }]
                    }, {
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
    },
    methods: {
        toggleMenu(name) {
            console.log('TOGGLIGNG MENU', name);
            this.activeMenu = (this.activeMenu === name) ? null : name;
        }
    }
}
</script>

<style scoped>
#filemenu {
    display: flex;
}

#filemenu li, #filemenu ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
#filemenu li {
    padding: 0.3em 0.6em;
    cursor: pointer;
}
#filemenu li:hover {
    background: #f7f7f7;
}

#filemenu ul {
    position: absolute;
    background: white;
    z-index: 2;
}
</style>

