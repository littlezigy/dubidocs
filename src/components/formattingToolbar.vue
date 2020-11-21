<template>
    <div>
		<button @click = "format('bold')"><span class="fa fa-bold fa-fw"></span></button>
		<button @click = "format('italic')"><span class="fa fa-italic fa-fw"></span></button>
		<button @click = "format('underline')"><span class="fa fa-underline fa-fw"></span></button>
		<button @click = "format('insertunorderedlist')"><span class="fa fa-list fa-fw"></span></button>
		<button @click = "format('insertorderedlist')"><span class="fa fa-list-ol fa-fw"></span></button>
		<button @click = "setUrl()"><span class="fa fa-link fa-fw"></span></button>
		<span><input id = "txtFormatUrl" placeholder="url" class="form-control"></span>
    </div>
</template>

<script>
export default {
    name: 'FormattingToolbar',
    data() {
        return {
        }
    },
    methods: {
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
</style>

