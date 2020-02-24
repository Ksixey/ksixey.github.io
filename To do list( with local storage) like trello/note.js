const Note = {
    idCounter: 8,
    dragged: null,

    process(noteElement) {
        noteElement.addEventListener('dblclick', function () {
            noteElement.setAttribute('contenteditable', 'true');
            noteElement.removeAttribute('draggable');
            //чтобы и колонка не перетаскивалась
            // closest поис вверх по иерархии
            noteElement.closest('.column').removeAttribute('draggable');
            noteElement.focus()
        });

        noteElement.addEventListener('blur', function () {
            noteElement.removeAttribute('contenteditable');
            noteElement.setAttribute('draggable', 'true');
            noteElement.closest('.column').setAttribute('draggable', 'true');
            //если длина контента равняется нулю то он удаляется и пробельные символы удаляются
            if (!noteElement.textContent.trim().length) {
                noteElement.remove()
            }
            // сохраняем каждый раз, когда изменяем
            Application.save();

        });

        noteElement.addEventListener('dragstart', Note.dragstart);
        noteElement.addEventListener('dragend', Note.dragend);
        noteElement.addEventListener('dragenter', Note.dragenter);
        noteElement.addEventListener('dragover', Note.dragover);
        noteElement.addEventListener('dragleave', Note.dragleave);
        noteElement.addEventListener('drop', Note.drop);
    },

    create(id = null, content = ''){
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.setAttribute('draggable', 'true');
        noteElement.textContent = content;
        //если у нас нет заметок, то мы создаем с нуля, если есть
        if(id) {
            noteElement.setAttribute('data-note-id', id);
        }else {
            noteElement.setAttribute('data-note-id', Note.idCounter);
        }
        Note.idCounter++;
        Note.process(noteElement);
        return noteElement;
    },

    dragstart(event) {
        event.stopPropagation();
        Note.dragged = this;
        this.classList.add('dragged')
    },

    dragend(event) {
        event.stopPropagation();
        Note.dragged = null;
        this.classList.remove('dragged');

        document.querySelectorAll('.note')
            .forEach(x => x.classList.remove('under'));

        //при заканчивание перетягивания
        Application.save();
    },

    dragenter(event) {
        event.stopPropagation();
        if (!Note.dragged || this === Note.dragged) {
            return
        }
        this.classList.add('under');
        console.log('enter')
    },

    dragover(event) {
        //отменяем стандартую обработку драговер
        event.preventDefault();
        if (!Note.dragged || this === Note.dragged) {
            return
        }
        console.log('over');

    },

    dragleave(event) {
        event.stopPropagation();
        if (!Note.dragged || this === Note.dragged) {
            return
        }
        this.classList.remove('under');

        console.log('leave')
    },

    drop(event) {
        event.stopPropagation();
        if (!Note.dragged || this === Note.dragged) {
            return
        }
        console.log('drop');
        //если одина и та же колонка
        if (this.parentElement === Note.dragged.parentElement) {
            const note = Array.from(this.parentElement.querySelectorAll('.note'));
            const indexA = note.indexOf(this);
            const indexB = note.indexOf(Note.dragged);

            if (indexA < indexB) {
                this.parentElement.insertBefore(Note.dragged, this)
            } else {
                this.parentElement.insertBefore(Note.dragged, this.nextElementSibling)
            }
        } else { //перемещаем нод в другие колонки
            // insertBefore - какой елемент вставляем и перед каким елементом. вставить карточку, которую я тащил перед карточкой на которую дропаю. У нас не может быть ссылки на один и тот же елемент в дом дереве
            this.parentElement.insertBefore(Note.dragged, this)
        }
    }

};



