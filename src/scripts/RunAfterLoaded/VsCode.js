Newtube.CreateCodeEditor = async function ({ parentElement, value, language, onInput, onChange }) {
     console.log("CreateCodeEditor")

     var editor;

     require.onError = function (params) {
          //console.log(params)
     }

     require.config({
          paths: {
               'vs': Newtube.ExtensionPath + 'scripts/libs/vs'
          }
     });

     var isFocused = false

     await new Promise(resolve => {
          require(['vs/editor/editor.main'], function () {
               editor = monaco.editor.create(parentElement, {
                    value: value || '',
                    language: language || 'javascript',
                    theme: 'vs-dark',
                    fontSize: 16,
                    lineHeight: 25,
                    tabSize: 8,
               });

               editor.onDidChangeModelContent(function (event) {
                    if (EditorFunction.onInput && typeof EditorFunction.onInput === 'function') {
                         EditorFunction.onInput(editor.getValue());
                    }
               });

               editor.onDidFocusEditorWidget(function () {
                    isFocused = true
               });

               editor.onDidBlurEditorText(function () {
                    isFocused = false
                    if (EditorFunction.onChange && typeof EditorFunction.onChange === 'function') {
                         EditorFunction.onChange(editor.getValue());
                    }
               });

               //console.log("Monaco Editor is ready");

               // Initialize ResizeObserver to observe parentElement for changes
               var resizeObserver = new ResizeObserver(function () {
                    editor.layout();
               });

               // Start observing the parentElement
               resizeObserver.observe(parentElement);

               resolve()
          });
     })

     var EditorFunction = {
          onInput: null,
          onChange: null,
          setValue: function (newValue) {
               editor.setValue(newValue);
          },
          isFocused: function () {
               return isFocused
          },
          GetText: function () {
               return editor.getValue()
          },
     }

     return EditorFunction
};

document.addEventListener(`${Newtube.ExtensionID}_Create_CodeEditor`, async function (e) {
     var Data = e.detail

     var parentElementID = Data.parentElementID
     var parentElement = document.getElementById(parentElementID)

     var codeEditor = await Newtube.CreateCodeEditor({
          parentElement: parentElement,
          value: Data.value,
          language: Data.language
     });

     codeEditor.onInput = function (Value) {
          parentElement.dispatchEvent(new CustomEvent("OnInput", {
               detail: Value
          }));
     }

     codeEditor.onChange = function (Value) {
          parentElement.dispatchEvent(new CustomEvent("OnChange", {
               detail: Value
          }));
     }

     var SetValue = function (e) {
          if (codeEditor.isFocused() || codeEditor.GetText() == e.detail) return
          codeEditor.setValue(e.detail)
     }

     parentElement.addEventListener("SetValue", SetValue)

     parentElement.addEventListener("Remove", function () {
          parentElement.removeEventListener("SetValue", SetValue)
     }, { once: true })

     parentElement.dispatchEvent(new CustomEvent("Complete"))
})