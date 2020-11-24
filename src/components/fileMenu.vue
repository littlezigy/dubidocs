<template>
    <ul id = 'filemenu'>
        <template v-for = '( item, index) in menu' :key = 'index'>
            <li @click = 'toggleMenu(item)'>{{ item.name }}
                <ul v-if = 'activeMenu === item.name || (item.children && item.children.map(a => a.name).includes(activeMenu))'>
                    <li @click.stop = 'toggleMenu(child)'  v-for = '( child, index) in item.children' :key = 'index'  >{{ child.name }}
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
                        name: 'Open',
                        action: 'open'
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
        toggleMenu(menu) {
            let name = menu.name;
            console.log('TOGGLIGNG MENU', menu.name);
            this.activeMenu = (this.activeMenu === name) ? null : name;

            if(menu.action)
                this.$emit('menu', menu.action);
        }
    }
}
</script>

<style scoped src = '@/assets/fileMenu.css'>
</style>

