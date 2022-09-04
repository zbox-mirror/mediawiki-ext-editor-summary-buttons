'use strict';

// Код из польской Википедии, изначально адаптированный для русскоязычного раздела Википедии by [[u:Alex Smotrov]]
// https://ru.wikipedia.org/w/index.php?diff=32005736&oldid=32004004&title=MediaWiki%3AEditpage.js&type=revision

function initSummaryButtons(mode) {
  function insertSummary(txt) {
    if (typeof txt !== 'string') {
      txt = this.title;
    }
    if (typeof summaryItemsSeparator === 'undefined') {
      window.summaryItemsSeparator = ',';
    }
    let val = $summary.val();
    let regExp = new RegExp('(^|[,;.?!/]) ?' + mw.RegExp.escape(txt));
    if (regExp.test(val)) {
      return;
    }
    if (/[^,; \/]$/.test(val)) {
      val += summaryItemsSeparator;
    }
    if (/[^ ]$/.test(val)) {
      val += ' ';
    }
    $summary.val(val + txt).focus().change();
  }

  mode = mode || 'classic';

  if (typeof summaryButtons === 'undefined') {
    window.summaryButtons = {
      hideDefaultButtons: false
    };
  }

  let veSaveDialog, $summaryWrapper, $summary;
  if (mode === 'classic') {
    $summaryWrapper = $('#wpSummaryWidget');
    $summary = $('#wpSummary');
  } else {
    veSaveDialog = ve.init.target.saveDialog;
    $summaryWrapper = veSaveDialog.editSummaryInput.$element;
    $summary = veSaveDialog.editSummaryInput.$input;
  }

  let $summaryButtons = $('<div>')
    .addClass('summaryButtons')
    .insertAfter($summaryWrapper);
  let $groups = $('<div>')
    .addClass('summaryButtons-groups')
    .appendTo($summaryButtons);

  window.addSumButton = window.addSummaryButton = function (label, text, group) {
    group = group || 'custom';  // default is 'default'
    let $group = $('.summaryButtons-group-' + group);
    if (!$group.length) {
      $group = $('<div>')
        .addClass('mw-ui-button-group summaryButtons-group summaryButtons-group-' + group)
        .appendTo($groups);
    }

    $('<a>')
      .attr('role', 'button')
      .attr('title', text)
      .addClass('mw-ui-button summaryButtons-button')
      .html(label)
      .click(insertSummary)
      .appendTo($group);
  };

  let buttons = mode !== 'visual' ?
    // Кнопки для обычного режима редактирования
    [
      'викиф|икация', 'оформл|ение', 'стил|евые правки', 'орфогр|афия', 'пункт|уация',
      'вопрос', 'ответ', 'комм|ентарий', 'кат|егоризация', 'к удал|ению', 'илл|юстрирование',
      'источ|ники', 'запр|ос источника', 'доп|олнение', 'уточн|ение', 'испр|авление',
      'обнов|ление', 'закр|ыто', 'итог'
    ] :
    // Кнопки для визуального редактора — без кнопок для обсуждений (визуальный редактор
    // не предназначен для использования на страницах обсуждения)
    [
      'викиф|икация', 'оформл|ение', 'стил|евые правки', 'орфогр|афия', 'пункт|уация',
      'кат|егоризация', 'к удал|ению', 'илл|юстрирование', 'источ|ники', 'запр|ос источника',
      'доп|олнение', 'уточн|ение', 'испр|авление', 'обнов|ление'
    ];

  if (!summaryButtons.hideDefaultButtons) {
    $.each(
      buttons,
      function (i, s) {
        addSummaryButton(s.replace(/\|.*/, ''), s.replace(/\|/, ''), 'default');
      }
    );
  }

  mw.hook('summaryButtons').fire();
}

if (window.ve && ve.init && ve.init.target && ve.init.target.active || $('.ve-loading').length) {
  mw.hook('ve.saveDialog.stateChanged').add(function () {
    if (!mw.config.get('wgArticleId') || $('.summaryButtons').length) return;
    initSummaryButtons(ve.init.target.getSurface().getMode());
  });
} else if (['edit', 'submit'].indexOf(mw.config.get('wgAction')) !== -1) {
  $(function () {
    var frm = document.getElementById('editform');
    if (!mw.config.get('wgArticleId') || !frm || $(frm.wpSection).val() === 'new') return;
    initSummaryButtons('classic');
  });
}
