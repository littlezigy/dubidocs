<template>
  <div class="home">
      <p>Go back to editing...</p>

      <button @click = 'newDocument'>New Document</button>

      <div id = 'documents'>
          <div v-for = '( doc, id,index) in docs' :key = 'index'
               @click = 'goToEditor(id)'
          >
              <p class = 'title'>{{ doc.title || 'Untitled Document' }}</p>

              <p class = 'date' v-if = 'doc.created'>Created on {{ doc.created }}</p>
          </div>
      </div>
  </div>
</template>

<script>
import { fetchAllDocuments } from '@/components/fetchDocuments';
import { createDocument } from '@/components/createDocument';

export default {
    name: 'Home',
    data(){
        return {
            docs: {}
        }
    },
    methods: {
        newDocument() {
            return createDocument(this.$store.state.user)
            .then(res => {
                console.log('CREATED DOC', res);
                this.$router.push({ name: 'Editor', params: { docID: res } });
            });
        },
        goToEditor(id) {
            this.$router.push({ name: 'Editor', params: { docID: id } });
        }
    },
    mounted() {
        return fetchAllDocuments(this.$store.state.user)
        .then(res => {
            if(res) {
                for (const key in res) {
                    let r = res[key]
                    console.log('RR', r);
                    this.docs[key] = r;
                    if(r.created)
                        this.docs[key].created = r.created.toLocaleString();
                }
            }
            console.lgo('DOCS', this.docs);
            console.log('FETHCED THOS DOCS BOSS', res);
        });
    }
}
</script>

<style>
#documents > div {
    cursor: pointer;
    border: 2px solid #0000ff50;
    display: flex;
    justify-content: space-between;
}
#documents > .date {
}
</style>
