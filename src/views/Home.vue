<template>
  <div class="home">
      <h2 class = 'dubidocs'>DubiDocs (BETA)</h2>
      <p class = 'github text-center'><a href = 'https://github.com/littlezigy/dubidocs'><i class ='fab fa-github'></i>Github</a></p>

      <div class = 'subtitle'>
          <p>DubiDocs is still in beta</p>
          <p>Please don't store any sensitive documents on DubiDocs</p>
      </div>

      <p class ='text-center'>Work anywhere you want to.</p>

      <button @click = 'newDocument'>New Document</button>

      <slot name = 'logoutButton'></slot>

      <h2 class = 'text-left'>Your Documents</h2>
      <div id = 'documents'>
          <div v-for = '( doc, id,index) in docs' :key = 'index'
               @click = 'openDocument(doc, id)'
          >
            <p class = 'title'>{{ doc.title || 'Untitled Document' }}</p>

            <p class = 'date' v-if = 'doc.created'>Created on {{ doc.created }}</p>
            </div>
        </div>
    </div>

    <div id = 'overlay' class = 'loading' v-if = 'loading === true'>
        <p>{{ loadingText }}</p>
    </div>
</template>

<script>
import { fetchAllDocuments } from '@/components/fetchDocuments';
import { createDocument } from '@/components/createDocument';
import * as skyidIntegration from '@/components/skyid-integration';

export default {
    name: 'Home',
    data(){
        return {
            docs: {},
            loadingText: '',
            loading: false
        }
    },
    watch: {
        loading(val) {
            this.loadingText = 'Creating your document on the blockchain';
            let counter = 0;
            let loadingTimer = setInterval(() => {
                if(counter > 3) {
                    this.loadingText = 'Creating your document on the blockchain';
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
        openDocument(doc, id) {
            console.log('OPENING DOCMENT', doc);
            this.$store.state.document = doc;
            this.loadingText = 'Opening your document';

            return this.goToEditor(id);
        },
        newDocument() {
            this.loading = true;
            return createDocument(this.$store.state.skyid)
            .then(res => {
                console.log('CREATED DOC', res);
                const { doc, id} = res;
                return this.openDocument(doc, id);
            });
        },
        goToEditor(id) {
            this.loading = false;
            this.$router.push({ name: 'Editor', params: { docID: id } });
        }
    },
    mounted() {
        let skyid = this.$store.state.skyid;
        return fetchAllDocuments(skyid)
        .then(res => {
            console.log('FETCHED ALLDOCS', res);
            if(res) {
                for (const key in res) {
                    let r = res[key]
                    this.docs[key] = r;
                    if(r.created)
                        this.docs[key].created = r.created.toLocaleString();
                }

                window.localStorage.setItem('docList', JSON.stringify(res));
            }
            console.log('DOCS', this.docs);
            console.log('FETHCED THOS DOCS BOSS', res);
        });
    }
}
</script>

<style scoped>
.subtitle {
    font-size: 0.8em;
    text-align: center;
}
p.subtitle, .subtitle p {
    margin-bottom: 0.3em;
    margin-top: 0.3em;
}
#overlay {
    background: rgba(0, 0, 0, 0.85);
}
#documents > div {
    cursor: pointer;
    border: 2px solid #0000ff50;
    display: flex;
    justify-content: space-between;
    font-size: 1.1rem;

    margin: 2em;
    padding: 0.2em 2em;
}
#documents > div:hover {
    background: #0000ff50;
}
#documents > .date {
}
div.home {
    padding: 2em 5em;
}

.dubidocs {
    font-size: 3em;
}
button {
    color: #2000af;
}
i {
    margin-right: 0.5rem;
}
</style>
