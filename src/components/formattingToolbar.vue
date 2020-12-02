<template>
    <div>
		<button @click = "format('bold')"><span class="fa fa-bold fa-fw"></span></button>
		<button @click = "format('italic')"><span class="fa fa-italic fa-fw"></span></button>
		<button @click = "format('underline')"><span class="fa fa-underline fa-fw"></span></button>
        <span class = 'divider'> | </span>
		<button @click = "format('insertunorderedlist')"><span class="fa fa-list fa-fw"></span></button>
		<button @click = "format('insertorderedlist')"><span class="fa fa-list-ol fa-fw"></span></button>

        <select name = 'customBlockFormat' @change = 'customFormat(customBlockFormat)' v-model = 'customBlockFormat'>
            <option value = '' selected disabled>Select Paragraph Style</option>
            <option v-for = '( item, index) in paragraphFormats' :key = 'index'  :value = 'item.name'>{{ item.title }}</option>
        </select>

		<button @click = "format('insertorderedlist')"><span class="fa fa-list-ol fa-fw"></span></button>

        <span class = 'divider'> | </span>
		<button @click = "format('justifyCenter')"><span class="fa fa-align-center fa-fw"></span></button>
		<button @click = "format('justifyFull')"><span class="fa fa-align-justify fa-fw"></span></button>
		<button @click = "format('justifyLeft')"><span class="fa fa-align-left fa-fw"></span></button>
		<button @click = "format('justifyRight')"><span class="fa fa-align-right fa-fw"></span></button>

		<button @click = "setUrl = true"><span class="fa fa-link fa-fw"></span></button>
		<button v-if = 'setUrl === true' @click = "setUrl()">Set URL</button>
    </div>
    <span v-if = 'setUrl === true'><input id = "txtFormatUrl" placeholder="setUrl" class="form-control"></span>
</template>

<script>
export default {
    name: 'FormattingToolbar',
    data() {
        return {
            setUrl: false,

            customBlockFormat: '',
            paragraphFormats: [{
                name: 'p',
                title: 'Paragraph'
            }, {
                name: 'heading1',
                title: 'Heading 1'
            }, {
                name: 'heading2',
                title: 'Heading 2'
            }, {
                name: 'h3',
                title: 'Heading 3'
            }, {
                name: 'h4',
                title: 'Heading 4'
            }, {
                name: 'h5',
                title: 'Heading 5'
            }, {
                name: 'h6',
                title: 'Heading 6'
            }]
        }
    },
    methods: {
        customFormat(type ) {
            console.log('FORAMTTING FOR', type);
            let tag;
            if(type == 'p')
                tag = 'p';
            else if(type == 'heading1')
                tag = 'h1';
            else if(type == 'heading2')
                tag = 'h2';

            else tag = type;
            console.log('TAG', tag);

            document.execCommand('formatBlock', false, tag);
        },
        format(command, value) {
			document.execCommand(command, false, value);
		},
		setUrl() {
			var url = document.getElementById('txtFormatUrl').value;
			var sText = document.getSelection();
			document.execCommand('insertHTML', false, '<a href="' + url + '" target="_blank">' + sText + '</a>');
			document.getElementById('txtFormatUrl').value = '';
		}
    }
}
</script>

<style scoped>
button {
    background: none;
    border: none;
}
span.divider {
    font-size: 1.7rem;
}

select {
    padding: 0.4em 1em;
    font-size: 1.3em;
}
</style>

