const Application = {
    save() {
    // object for saving
        const object = {
            columns: {
                idCounter: Column.idCounter,
                items: []
            },
            notes: {
                idCounter: Note.idCounter,
                items: []
            }
        };

        document.querySelectorAll('.column')
            .forEach(colEl => {
                const column = {
                    id: parseInt(colEl.getAttribute('data-column-id')),
                    noteIds: []
                };
                colEl.querySelectorAll('.note')
                    .forEach(noteEl => column.noteIds.push(parseInt(noteEl.getAttribute('data-note-id'))));
                object.columns.items.push(column)
            });

        document.querySelectorAll('.note')
            .forEach(noteEl => {
                const note = {
                    id: parseInt(noteEl.getAttribute('data-note-id')),
                    content: noteEl.textContent
                };
                object.notes.items.push(note)
            });

        const json = JSON.stringify(object);

        localStorage.setItem('to do list', json);

        return object

    },

    load() {
        //если в локал сторидж наши данные сохранились
        if(!localStorage.getItem('to do list')){
            return
        }
//очищаем наш блок с колонкой
        const mountPoint = document.querySelector('.columns');
        mountPoint.innerHTML = '';

        const object = JSON.parse(localStorage.getItem('to do list'));
        const getNoteById = id => object.notes.items.find(note => note.id === id);
        //пройтись по всем колонкам которые распарсили
        for (const column of object.columns.items){
            const columnElement = Column.create(column.id);
            //сюда монтируем наши колонки, которые мы распарсили с локал сторидж
            mountPoint.append(columnElement);
            for (const noteId of column.noteIds){
                const note = getNoteById(noteId);
                const noteElement = Note.create(note.id, note.content);
                columnElement.querySelector('[data-notes]').append(noteElement)
            }
        }

    }
};