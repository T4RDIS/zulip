var avatar = (function () {

var exports = {};

function is_image_format(file) {
    var type = file.type;
    if (!type) return false;

    var supported_types = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml'
    ];
    return $.inArray(type, supported_types) >= 0;
}

exports.set_up_avatar_logic_for_creating_bots = function () {

    // We have to do strange gyrations with the file input to clear it,
    // where we replace it wholesale, so we generalize the file input with
    // a callback function.
    var get_file_input = function () {
        return $('#bot_avatar_file_input');
    };

    var file_name_field = $('#bot_avatar_file');
    var input_error = $('#bot_avatar_file_input_error');
    var clear_button = $('#bot_avatar_clear_button');
    var upload_button = $('#bot_avatar_upload_button');

    function accept_bot_avatar_file_input(file) {
        file_name_field.text(file.name);
        input_error.hide();
        clear_button.show();
        upload_button.hide();
    }

    function clear_bot_avatar_file_input() {
        var control = get_file_input();
        var new_control = control.clone(true);
        control.replaceWith(new_control);
        file_name_field.text('');
        clear_button.hide();
        upload_button.show();
    }

    clear_button.click(function (e) {
        clear_bot_avatar_file_input();
        e.preventDefault();
    });

    upload_button.on('drop', function (e) {
        var files = e.dataTransfer.files;
        if (files === null || files === undefined || files.length === 0) {
            return false;
        }
        get_file_input().get(0).files = files;
        e.preventDefault();
        return false;
    });

    var validate_avatar = function (e) {
        if (e.target.files.length === 0) {
            input_error.hide();
        } else if (e.target.files.length === 1) {
            var file = e.target.files[0];
            if (file.size > 5*1024*1024) {
                input_error.text('File size must be < 5Mb.');
                input_error.show();
                clear_bot_avatar_file_input();
            }
            else if (!is_image_format(file)) {
                input_error.text('File type is not supported.');
                input_error.show();
                clear_bot_avatar_file_input();
            } else {
                accept_bot_avatar_file_input(file);
            }
        }
        else {
            input_error.text('Please just upload one file.');
        }
    };

    get_file_input().change(validate_avatar);

    upload_button.click(function (e) {
        get_file_input().trigger('click');
        e.preventDefault();
    });

    return clear_bot_avatar_file_input;
};

return exports;

}());