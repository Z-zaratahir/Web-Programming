$(document).ready(function() {
    
    $('#addbtn').click(function() {
        addtask();
    });
    
    $('#taskinput').keypress(function(e) {
        if(e.which == 13) {
            addtask();
        }
    });
    
    function addtask() {
        var tasktext = $('#taskinput').val().trim();
        
        if(tasktext === '') {
            alert('please enter a task');
            return;
        }
        
        var taskhtml = '<li class="task-item">' +
                       '<span class="task-text">' + tasktext + '</span>' +
                       '<div class="task-btns">' +
                       '<button class="completebtn">complete</button>' +
                       '<button class="deletebtn">delete</button>' +
                       '</div>' +
                       '</li>';
        
        $('#tasklist').append(taskhtml);
        $('#taskinput').val('');
        checkbtnvisibility();
    }
    
    $(document).on('click', '.completebtn', function() {
        var taskitem = $(this).closest('.task-item');
        taskitem.addClass('completed');
        
        setTimeout(function() {
            taskitem.fadeOut(300, function() {
                taskitem.remove();
                checkbtnvisibility();
            });
        }, 500);
    });
    
    $(document).on('click', '.deletebtn', function() {
        var taskitem = $(this).closest('.task-item');
        taskitem.fadeOut(300, function() {
            taskitem.remove();
            checkbtnvisibility();
        });
    });
    
    $('#markallbtn').click(function() {
        $('.task-item').addClass('completed');
        
        setTimeout(function() {
            $('.task-item').fadeOut(300, function() {
                $(this).remove();
                checkbtnvisibility();
            });
        }, 500);
    });
    
    function checkbtnvisibility() {
        if($('#tasklist .task-item').length > 0) {
            $('#markallbtn').show();
        } else {
            $('#markallbtn').hide();
        }
    }
    
});
