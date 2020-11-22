<template>
    <ul id = 'filemenu'>
        <template v-for = '( item, index) in menu' :key = 'index'>
            <li @click = 'toggleMenu(item.name)'>{{ item.name }}
                <ul v-if = 'activeMenu === item.name || (item.children && item.children.map(a => a.name).includes(activeMenu))'>
                    <li @click.stop = 'toggleMenu(child.name)'  v-for = '( child, index) in item.children' :key = 'index'  >{{ child.name }}
                        <ul v-if = 'activeMenu === child.name'>
                            <li @click = 'stop'  v-for = '( child, index) in child.children' :key = 'index'  >{{ child.name }}
                            </li>
                        </ul>
                    </li>
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
                        name: 'Doc 1',
                      }, {
                        name: 'Document 2'
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

<style scoped src = '@/assets/fileMenu.css'>
</style>

