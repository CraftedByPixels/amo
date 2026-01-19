define([], function () {
  'use strict';

  return function () {
    var self = this;

    function getDefaultNoteText() {
      return (self.params && self.params.note_text) ? String(self.params.note_text) : 'Тестовая заметка';
    }

    function setStatus(text, type) {
      self.$el.find('.qn-status').attr('data-type', type || '').text(text || '');
    }

    function setLoading(isLoading) {
      self.$el.find('.qn-btn').prop('disabled', !!isLoading);
    }

    function renderUI() {
      self.$el.html(
        '<div class="qn-widget">' +
          '<div class="qn-title">Быстрая заметка</div>' +
          '<button class="qn-btn">Добавить заметку</button>' +
          '<div class="qn-status"></div>' +
        '</div>'
      );
    }

    this.callbacks = {
      init: function () {
        return true;
      },

      render: function () {
        renderUI();
        return true;
      },

      bind_actions: function () {
        self.$el.on('click', '.qn-btn', async function () {
          try {
            var leadId = self.entity.id;
            if (!leadId) {
              setStatus('Не удалось определить ID сделки', 'error');
              return;
            }

            setLoading(true);
            setStatus('Сохраняю...', 'loading');

            var text = getDefaultNoteText();

            self.$authorizedAjax({
              url: '/api/v4/leads/' + leadId + '/notes',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify([{
                note_type: 'common',
                params: {
                  text: text
                }
              }])
            })
            .done(function () {
              setStatus('Готово', 'success');
            })
            .fail(function (e) {
              console.log('QuickNote error', e);
              setStatus('Ошибка при сохранении', 'error');
            })
            .always(function () {
              setLoading(false);
            });
          } catch (e) {
            console.error('QuickNote exception', e);
            setStatus('Ошибка', 'error');
            setLoading(false);
          }
        });

        return true;
      },

      settings: function () {
        return true;
      },

      onSave: function () {
        return true;
      },

      destroy: function () {
        if (self.$el) self.$el.off();
      }
    };

    return this;
  };
});
