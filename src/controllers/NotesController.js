const knex = require("../database/knex")

class NotesController {
    async create(request, response) {
        
        const { title, description, tags, links } = request.body
        const user_id = request.user.id

        console.log(user_id)
        
        const [note_id] = await knex("notes").insert({
            title,
            description,
            user_id
        }); // Quer dizer que nessa tabela estou inserindo title, description, e o user_id
        

        const linksInsert = links.map(link => { // links.map => quer dizer que para cada link que peguei no body da request, return node_ id 
            return {
                note_id,
                url: link // transformando o note_id em url
            }
        })

        await knex("links").insert(linksInsert)


        const tagsInsert = tags.map(name => {
            return {
                name,
                note_id,
                user_id
            }
        })
        

        await knex("tags").insert(tagsInsert)


       return response.json()
    } 

    async show(request, response) {
        const { id } = request.params

        const note = await knex("notes").where({id}).first()

        const tags = await knex("tags").where({note_id: id}).orderBy("name")

        const links = await knex("links").where({note_id: id}).orderBy("created_at")

        return response.json({
            ...note,
            tags,
            links
        })
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("notes").where({id}).delete();

        return response.json();

    }

    async index(request, response){
        const { title, tags } = request.query;
        const user_id = request.user.id;
        let notes;

        if(tags){

            const filterTags = tags.split(",").map(tag => tag.trim())

            notes = await knex("tags")
            .select([
                'notes.id',
                'notes.title',
                'notes.user_id'
            ])
            .where("notes.user_id", user_id)
            .whereLike("notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("notes", "notes.id", "tags.note_id")
            .orderBy("notes.title")

        }
        else{

            notes = await knex("notes")
            .where({user_id})
            .orderBy("title")
            .whereLike("title", `%${title}%`)
        }

        const usersTags = await knex("tags").where({user_id}) // Peguei dentro de tags as tags que tem o mesmo id do user

        const notesWithTags = await notes.map(note => { //Crie a const noteWithTags que percorre com map as notes
            const noteTags = usersTags.filter(tag => tag.note_id === note.id) /*percorri as tags vinculadas com o id do user(userTags) 
            filtrando pelo id da note, vai retornar somente as tags vinculado com id da note*/
                                                                            

            return {
                ...note, /**espalhei dentro de note as tags vinculadas com o id da note pegue acima*/
                tags: noteTags
            }
        })

        return response.json(notesWithTags)

    }
}
module.exports = NotesController;

