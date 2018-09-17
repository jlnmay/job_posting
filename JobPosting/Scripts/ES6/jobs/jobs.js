const jobService = require("./job.service");

class Jobs {
    init() {
        let _this = this;
        _this.Id = 0;
        _this.addValidationForm();
        _this.addModalEvents();
        _this.addButtonsEvent();
    }

    addModalEvents() {
        let _this = this; 
       
        $("#jobModal").on("shown.bs.modal", function () {
            $("#txtTitle").focus();
            if (_this.Id > 0) {
                _this.getRowById();
            }
        });

        $("#jobModal").on("hidden.bs.modal", function () {
            $("#txtTitle").val("");
            $("#txtDescription").val("");
            $("#txtContactEmail").val("");
            _this.Id = 0; 
        });
    }

    addButtonsEvent() {
        let _this = this; 
        $("a.edit").off("click");
        $("a.edit").on("click", function () {
            _this.Id = $(this).data("id");
            _this.callModal("E");
        });

        $("a.delete").off("click");
        $("a.delete").on("click", function () {
            _this.Id = $(this).data("id");
            _this.callDeleteModal();
        });
    }

    callDeleteModal() {
        $("#deleteModal").modal("show"); 
    }

    addValidationForm() {
        let _this = this; 
        let form = $('#jobForm');
        let error = $('.alert-danger', form);
        let success = $('.alert-success', form);

        form.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input,
            rules: {
                title: {
                    required: true
                },
                description: {
                    required: true
                },
                contactEmail: {
                    required: true,
                    email: true
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success.hide();
                error.show();
            },
            errorPlacement: function (error, element) { // render error placement for each input type
                element.after(error); 
            },
            highlight: function (element) { // hightlight error inputs

                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
            },
            submitHandler: function (form) {
                success.show();
                error.hide();
                _this.save();
            }
        });
    }

    validate() {
        $("#jobForm").submit();
    }

    callModal(action="N") {
        let _this = this; 
        _this.action = action;
        
        if (action === "N") {
            $("#jobModal").find(".modal-title").html("New: Job");
            _this.Id = 0; 
        } else {
            $("#jobModal").find(".modal-title").html("Edit: Job");
        }

        $("#jobModal").modal("show");
    }

    getRowById() {
        let _this = this; 
        $("#jobModal").find(".modal-content").block({ message: "Loading..." }); 
        jobService.getRowById(_this.Id).then((response) => {
            let data = response.data; 
            $("#txtTitle").val(data.Title);
            $("#txtDescription").val(data.Description);
            $("#txtContactEmail").val(data.ContactEmail);
            $("#jobModal").find(".modal-content").unblock();
        }).catch((error) => {
            console.error(error);
            $("#jobModal").find(".modal-content").unblock();
        });
    }

    save() {
        let _this = this; 
        $("#jobModal").find(".modal-content").block({ message: "Saving..." }); 

        let data = {
            Id: _this.Id,
            Title: $("#txtTitle").val(),
            Description: $("#txtDescription").val(),
            ContactEmail: $("#txtContactEmail").val(),
            UserId: ""
        };

        jobService.save(data).then((response) => {
            let data = response.data; 
            $("#jobModal").find(".modal-content").unblock(); 
            if (_this.Id === 0) {
                _this.updateUserJobsList(data);
                _this.initializeControls();
            } else {
                $("#jobModal").modal("hide");
                _this.updateUserJob(data);
            }
        }).catch((error) => {
            console.error(error);
            $("#jobModal").find(".modal-content").unblock(); 
        });
    }

    updateUserJob(data) {
        let $job = $("#job" + data.Id);
        $job.find(".title h4").html(data.Title);
        $job.find(".text-description > p").html(data.Description);
        $job.find("small").html("<b>Contact email:</b> " + data.ContactEmail);
    }

    updateUserJobsList(data) {
        let _this = this; 

        if ($(".no-jobs-message").length > 0) {
            $(".no-jobs-message").remove();
        }

        let job = `<div id="job${data.Id}" class="modal-content">
                        <div class="modal-body">
                            <div class="title">
                                <h4>${data.Title}</h4>
                                <div class="buttons pull-right">
                                    <a class="pointer-cursor edit" data-id="${data.Id}">
                                        <i class="fa fa-edit"></i>
                                    </a>
                                    <a class="pointer-cursor delete" data-id="${data.Id}">
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="text-description">
                                <p>${data.Description}</p>
                            </div>
                            <div> 
                                <small><b>Contact email:</b> ${data.ContactEmail}</small>
                            </div>
                        </div>
                    </div>`;
        $(".list-group").append(job);
        _this.addButtonsEvent();
    }
    
    initializeControls() {
        $("#txtTitle").val("");
        $("#txtDescription").val("");
        $("#txtContactEmail").val("");
    }

    deleteRow() {
        let _this = this; 
        $("#deleteModal").modal("hide");
        $.blockUI({ message: "Deleting..."});
        jobService.deleteRow(_this.Id).then((response) => {
            let data = response.data;
            $(`#job${_this.Id}`).remove();
            _this.Id = 0;
            $.unblockUI();
            $.bootstrapGrowl(data.message, {
                type: 'info', 
                offset: {from: 'top', amount: 20}, 
                align: 'right', 
                width: 250, 
                delay: 3000, 
                allow_dismiss: true, // If true then will display a cross to close the popup
            });
            if ($(".list-group").find(".modal-content").length === 0) {
                $(".list-group").append(`
                    <div class="no-jobs-message text-center">
                        <h4>You haven't posted jobs yet</h4>
                    </div>    
                 `);
            }
        }).catch((error) => {
            $.unblockUI(); 
        });
    }
}

module.exports = Jobs;