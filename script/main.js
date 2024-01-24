
new Vue({
  el: '#app',
  data() {
    return {
      plannedTasks: [],
      inProgressTasks: [],
      testingTasks: [],
      completedTasks: [],
      newCardTitle: '',
      newCardDescription: '',
      newCardDeadline: ''
    };
  },
  mounted() {
    this.loadTasksFromStorage();
  },
  watch: {
    plannedTasks: { handler: 'saveTasksToStorage', deep: true },
    inProgressTasks: { handler: 'saveTasksToStorage', deep: true },
    testingTasks: { handler: 'saveTasksToStorage', deep: true },
    completedTasks: { handler: 'saveTasksToStorage', deep: true },
  },
  methods: {
    toggleFavorite(card) {
      const column = this.findColumn(card);

      if (column) {
          const index = column.indexOf(card)

          console.log(column);
          column[index].favorite = !column[index].favorite
      }
  },
    addCard() {
      const newCard = {
        id: Date.now(),
        title: this.newCardTitle,
        description: this.newCardDescription,
        deadline: this.newCardDeadline,
        lastEdited: new Date().toLocaleString(),
        returnReason: '',
        isFavorite: false, 
      };

      this.plannedTasks.push(newCard);
      this.clearForm();
    },
    validateDate() {
      const yearInput = document.querySelector('input[type="date"]');
      const enteredDate = yearInput.value;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(enteredDate)) {
        console.log('Ошибка! Неправильный формат даты.');
      }
    },
    editCard(card) {
      const newTitle = prompt('Введите новый заголовок', card.title);
      const newDescription = prompt('Введите новое описание', card.description);

      if (newTitle && newDescription) {
        card.title = newTitle;
        card.description = newDescription;
        card.lastEdited = new Date().toLocaleString();
      }
    },
    deleteCard(card) {
      const column = this.findColumn(card);

      if (column) {
        column.splice(column.indexOf(card), 1);
      }
    },
    toggleFavorite(card) {
      card.isFavorite = !card.isFavorite;
    },
    moveToInProgress(card) {
      this.plannedTasks.splice(this.plannedTasks.indexOf(card), 1);
      card.lastEdited = new Date().toLocaleString();
      this.inProgressTasks.push(card);
    },
    moveToTesting(card) {
      this.inProgressTasks.splice(this.inProgressTasks.indexOf(card), 1);
      card.lastEdited = new Date().toLocaleString();
      this.testingTasks.push(card);
    },
    moveToCompleted(card) {
      this.testingTasks.splice(this.testingTasks.indexOf(card), 1);
      card.lastEdited = new Date().toLocaleString();

      if (this.isDeadlineExpired(card.deadline)) {
        card.title += ' просрочена';
      } else {
        card.title += ' заранее';
      }

      this.completedTasks.push(card);
    },
    returnToProgress(card) {
      const reason = prompt('Введите причину возврата', '');

      if (reason) {
        this.testingTasks.splice(this.testingTasks.indexOf(card), 1);
        card.lastEdited = new Date().toLocaleString();
        card.returnReason = reason;
        this.inProgressTasks.push(card);
      }
    },
    isDeadlineExpired(deadline) {
      const currentDate = new Date();
      const deadlineDate = new Date(deadline);

      return currentDate > deadlineDate;
    },
    clearForm() {
      this.newCardTitle = '';
      this.newCardDescription = '';
      this.newCardDeadline = '';
    },
    findColumn(card) {
      if (this.plannedTasks.includes(card)) {
        return this.plannedTasks;
      } else if (this.inProgressTasks.includes(card)) {
        return this.inProgressTasks;
      } else if (this.testingTasks.includes(card)) {
        return this.testingTasks;
      } else if (this.completedTasks.includes(card)) {
        return this.completedTasks;
      } else {
        return null;
      }
    },
    saveTasksToStorage() {
      const tasks = {
        plannedTasks: this.plannedTasks,
        inProgressTasks: this.inProgressTasks,
        testingTasks: this.testingTasks,
        completedTasks: this.completedTasks,
      };
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    loadTasksFromStorage() {
      const tasks = localStorage.getItem('tasks');

      if (tasks) {
        const parsedTasks = JSON.parse(tasks);
        this.plannedTasks = parsedTasks.plannedTasks || [];
        this.inProgressTasks = parsedTasks.inProgressTasks || [];
        this.testingTasks = parsedTasks.testingTasks || [];
        this.completedTasks = parsedTasks.completedTasks || [];
      }
    },
  },
  computed: {
      sortedPlannedTasks() {
          console.log(this.plannedTasks);
          return this.plannedTasks.sort((a, b) => {
              if (a.favorite && !b.favorite) {
                  return -1;
              } else if (!a.favorite && b.favorite) {
                  return 1;
              }
              return 0;
          });
      },
      sortedInProgressTasks() {
          console.log(this.inProgressTasks);
          return this.inProgressTasks.sort((a, b) => {
              if (a.favorite && !b.favorite) {
                  return -1;
              } else if (!a.favorite && b.favorite) {
                  return 1;
              }
              return 0;
          });
      },
      sortedtestingTasks() {
          console.log(this.testingTasks);
          return this.testingTasks.sort((a, b) => {
              if (a.favorite && !b.favorite) {
                  return -1;
              } else if (!a.favorite && b.favorite) {
                  return 1;
              }
              return 0;
          });
      },
      sortedcompletedTasks() {
          console.log(this.completedTasks);
          return this.completedTasks.sort((a, b) => {
              if (a.favorite && !b.favorite) {
                  return -1;
              } else if (!a.favorite && b.favorite) {
                  return 1;
              }
              return 0;
          });
      }
  },
});
