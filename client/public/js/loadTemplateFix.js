define([
    "backbone.marionette",
], function (Marionette) {
  // Fix Marionette TemplateCache + RequireJS
  Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
    // Marionette expects "templateId" to be the ID of a DOM element.
    // But with RequireJS, templateId is actually the full text of the template.
    var template = templateId;

    // Make sure we have a template before trying to compile it
    if (!template || template.length === 0){
      var msg = "Could not find template: '" + templateId + "'";
      var err = new Error(msg);
      err.name = "NoTemplateError";
      throw err;
    }

    return template;
  };
});