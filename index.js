var app = angular.module("Platform.Plugin.Apps").controller("Caas.Applications.ApplicationListController", [
    "$rootScope",
    "$scope",
    "$interval",
    "$filter",
    "$q",
    "$state",
    "$stateParams",
    "$timeout",
    "$transitions",
    "CaaS.Common.Constants",
    "CaaS.Common.Strings",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.DataCenterService",
    "CaaS.Services.ServerService",
    "CaaS.Services.UserSessionService",
    "CaaS.Services.UIService",
    "CaaS.Services.JobMonitorService",
    "CaaS.Services.TagsService",
    "CaaS.Services.DeployServerService",
    "CaaS.Services.ImagesFilterService",
    function (n, t, i, r, u, f, e, o, s, h, c, l, a, v, y, p, w, b, k, d) {
        var g = [],
            it;
        t.availableGeos = null;
        t.selectedGeo = null;
        t.windowsImageVersions = h.windowsImageVersions;
        t.linuxImageVersions = h.linuxImageVersions;
        t.deploymentTemplateCategories = ["Databases", "Tools", "Samples", "Docker Containers"];
        t.isLoading = !1;
        t.searchText = "";
        t.view = "";
        t.targetSection = null;
        t.isClientImageCopyingNotAllowed = !1;
        t.isClientImageExportingNotAllowed = !1;
        t.activeSection = "All";
        t.imageMenuTemplate = $("#ImageMenuTemplate").html();
        t.listViewTooltip = c.listViewTooltip;
        t.thumbnailViewTooltip = c.thumbnailViewTooltip;
        t.currentActionTooltip = "<span>{{getClientImageActionInProgressDescription(dataItem.progress)}}</span>";
        t.copyImageDisabledForLTRImageTooltip = "";
        t.moveImageDisabledForLTRImageTooltip = "";
        t.exportImageDisabledForLTRImageTooltip = "";
        t.GetosImageAdvSettingValues = function (n) {
            return n ? _.findWhere(h.osImageAdvSettingValues, { id: n }).name : "";
        };
        t.GetosImageAdvSettingkeys = function (n) {
            return n &&
                _.filter(h.osImageAdvSettingKeys, function (t) {
                    return t.id.toLowerCase() === n.toLowerCase();
                }).length > 0
                ? _.filter(h.osImageAdvSettingKeys, function (t) {
                      return t.id.toLowerCase() === n.toLowerCase();
                  })[0].name
                : "";
        };
        var rt = function () {
                var n = $("#imagesGrid").data("kendoGrid");
                return t.isListView ? (!n ? null : n.dataSource.data()) : t.dataSource.data();
            },
            ut = function (n) {
                if (!n.progress) return null;
                switch (n.progress.action) {
                    case h.customerImagesAction.COPY_IMAGE:
                    case h.customerImagesAction.COPY_CUSTOMER_IMAGE:
                        return n.state === h.customerImagesState.PENDING_CHANGE ? c.Copying : null;
                    case h.customerImagesAction.RECONFIGURE_IMAGE:
                        return n.state === h.customerImagesState.PENDING_CHANGE ? c.Reconfiguring : null;
                    case h.customerImagesAction.DELETE_SERVER_IMAGE:
                        return n.progress.failureReason ? null : c.Deleting;
                    default:
                        return null;
                }
            },
            ft = function (n) {
                var i = rt(),
                    t = _.findWhere(i, { id: n.id });
                !t || ((t.actionInProgress = ut(n)), (t.progress = !n.progress || t.actionInProgress ? null : n.progress));
            },
            ot = function (n) {
                _.each(n, function (n) {
                    ft(n);
                });
            },
            st = function (n) {
                var t = rt();
                _.each(t, function (t) {
                    t.id === n.id && ((t.actionInProgress = c.Deleting), (t.guest.operatingSystem.displayName = ""), w.addDeletedClientImage(e.geoKey, n.image));
                });
            },
            lt = function (n) {
                var r = $("#imagesGrid").data("kendoGrid"),
                    i,
                    t;
                if (r != null)
                    for (i = r.dataSource.data(), t = 0; t < i.length; t++)
                        if (i[t].id === n.id) {
                            i[t].started = n.image.state === "PENDING_ADD";
                            i[t].state = n.image.state;
                            i[t].displayState = n.displayState;
                            i[t].job = n.image.progress;
                            break;
                        }
            },
            nt = function (n) {
                var u, i, r;
                g = _.filter(n, function (n) {
                    return !!n && !!n.progress && n.state.toLowerCase().indexOf("failed") === -1 && n.state.toLowerCase().indexOf("requires_support") === -1 && !n.progress.failureReason;
                });
                setTimeout(
                    function (n) {
                        ot(n);
                    },
                    10,
                    g
                );
                u = _.filter(g, function (n) {
                    return n.progress.action !== h.customerImagesAction.DELETE_SERVER_IMAGE && n.progress.action !== h.customerImagesAction.DELETE_CUSTOMER_IMAGE;
                });
                w.addClientImages(e.geoKey, u);
                i = _.filter(g, function (n) {
                    return n.progress.action === h.customerImagesAction.COPY_CUSTOMER_IMAGE;
                });
                t.isClientImageCopyingNotAllowed = !!i && i.length >= 2;
                r = _.filter(g, function (n) {
                    return n.progress.action === h.customerImagesAction.IMAGE_EXPORT;
                });
                t.isClientImageExportingNotAllowed = !!r && r.length >= 2;
            },
            tt = function (n) {
                nt(n);
                o(function () {
                    var n = $("#listView").data("kendoListView");
                    !n || n.refresh();
                }, 10);
            };
        t.loadFilteredImages = function () {
            if (((t.activeSection = "All"), t.isListView)) {
                var n = $("#imagesGrid").data("kendoGrid"),
                    i = $("#imagesGrid"),
                    n = i.data("kendoGrid");
                !n ||
                    ((t.isLoading = !0),
                    l.filterImages(
                        e.geoKey,
                        t.filterQuery,
                        function (r) {
                            t.filterQuery.showClientImage && tt(r);
                            !n || !n.dataSource || (nt(r), n.dataSource.data(r), n.dataSource.page(1), n.refresh());
                            kendo.ui.progress(i, !1);
                            t.isLoading = !1;
                        },
                        function () {
                            t.isLoading = !0;
                        }
                    ));
            } else ht(t.dataSource, e.geoKey, t.filterQuery, tt);
        };
        t.loadLatestFilteredImages = function () {
            d.clearImageCache(t.loadFilteredImages());
        };
        var ht = function (n, i, r, u) {
                n.data([]);
                n.page(1);
                n.transport.read = function (n) {
                    d.filterImages(
                        i,
                        t.filterQuery,
                        function (i) {
                            nt(i);
                            t.filterQuery.showClientImage && !!u && u(i);
                            n.success(i);
                        },
                        n.error
                    );
                };
            },
            ct = function () {
                it();
                t.activeSection = "All";
                t.view = "AppStoreItems";
                t.loadFilteredImages();
            },
            et = [];
        t.main = function () {
            t.resetFilters();
            t.setDisabledTooltipStringsForLTRImages();
            e.imageName && (t.filterQuery.searchText = e.imageName);
            a.getDatacenters(e.geoKey, function (n) {
                et = _.filter(n, function (n) {
                    return n.networking.type === 2;
                });
                t.datacenters = n;
            });
        };
        t.isMcp2Datacenter = function (n) {
            return _.some(n, function (n) {
                return _.some(et, function (t) {
                    return t.location === n.key;
                });
            });
        };
        t.listViewOptions = { selectable: "multiple" };
        t.dataSource = new kendo.data.DataSource({
            transport: {
                cache: !1,
                read: function (n) {
                    n.success([]);
                },
            },
            pageSize: 20,
            requestStart: function () {
                t.isLoading = !0;
            },
            requestEnd: function () {
                t.isLoading = !1;
            },
        });
        t.$on(h.events.caasApplicationIndexControllerStateChangeSuccess, function () {
            if (!!e && !!e.geoKey)
                y.onGeosLoaded(function () {
                    y.changeGeo(e.geoKey);
                    t.availableGeos = y.availableGeos;
                    t.selectedGeo = y.selectedGeo;
                    l.getSoftwareLabels(e.geoKey, function (n) {
                        t.softwareLabels = n;
                    });
                    ct();
                });
        });
        t.$on(h.events.serverActionCompleted, p.showEventNotification);
        t.$on(h.events.serverActionFailed, p.showEventNotification);
        t.$on(h.events.serverActionRequested, function (n, t) {
            t.action === h.serverActions.createServer && p.showEventNotification(n, t);
        });
        t.$on(h.events.jobManagementActionRequested, function (n, t) {
            t.action === h.jobManagementActions.deployTemplate && p.showEventNotification(n, t);
        });
        t.$on(h.events.imageApplicationActionRequested, function (n, i) {
            (i.action === h.imageApplicationActions.removeClientImage || i.action === h.imageApplicationActions.removeFailedClientImage || i.action === h.imageApplicationActions.removeLongTermRetentionImage) && st(i);
            (i.action === h.imageApplicationActions.copyClientImage ||
                i.action === h.imageApplicationActions.exportClientImage ||
                i.action === h.imageApplicationActions.editClientImage ||
                i.action === h.imageApplicationActions.reconfigureImage ||
                i.action === h.imageApplicationActions.moveCustomerImage) &&
                setTimeout(function () {
                    t.loadLatestFilteredImages();
                }, 1e3);
            p.showEventNotification(n, i);
        });
        t.$on(h.events.imageApplicationActionCompleted, function (n, i) {
            p.showEventNotification(n, i);
            setTimeout(function () {
                t.loadLatestFilteredImages();
            }, 1e3);
        });
        t.$on(h.events.jobStateChanged, function (n, i) {
            if (i.action === h.imageApplicationActions.copyOvfPackageFromRemoteGeo) {
                var r = _.findWhere(t.dataSource.data(), { remoteCopyId: i.id });
                r && (r.status = i.status);
            } else (i.action === h.imageApplicationActions.copyClientImage || i.action === h.imageApplicationActions.removeClientImage || i.action === h.imageApplicationActions.importClientImage || i.action === h.imageApplicationActions.reconfigureImage || i.action === h.imageApplicationActions.exportClientImage) && ft(i.image);
        });
        t.$on(h.events.regionActionCompleted, p.showEventNotification);
        t.$on(h.events.tagManagementActionCompleted, function (n, i) {
            switch (i.action) {
                case h.tagManagementActions.applyTags:
                    t.loadFilteredImages();
            }
            p.showEventNotification(n, i);
        });
        t.searchImages = function (n) {
            window.history.pushState({}, document.location.pathName, "#/" + e.geoKey + "/" + n);
            t.view = "AppStoreItems";
            t.filterQuery.searchText = n;
            t.loadFilteredImages();
        };
        t.refresh = function (n, i) {
            w.removeAllItems();
            n.data([]);
            var r = !0;
            i && i != t.dataSource.pageSize() && (n.pageSize(i), (r = !1));
            n.page() != 1 && (n.page(1), (r = !1));
            r && n.read();
        };
        t.handleSearchKeyPress = function (n) {
            n.which === 13 && t.searchImages();
        };
        t.getTemplateById = function (n) {
            return $("#" + n).html();
        };
        t.getDataCenterList = function (n) {
            return _.map(n.dataCenterIds, _.iteratee("key")).join(", ");
        };
        t.deployImage = function (n) {
            k.showDeployServerDialog(e.geoKey, n);
        };
        t.getImageDetails = function (n) {
            if (n.imageType === h.appStoreImageTypes.deploymentTemplate) {
                l.showDeployTemplateDialog(e.geoKey, n);
                return;
            }
            if (n.imageType === h.appStoreImageTypes.customerImage) {
                ((!!n.progress || !!n.actionInProgress) && !t.isClientImageActionFailed(n)) ||
                    l.showClientImageDetailsDialog(e.geoKey, n, g, t.isClientImageCopyingNotAllowed, t.isClientImageExportingNotAllowed, t.isMcp2Datacenter(n.dataCenterIds));
                return;
            }
            var i = !!n.softwareLabelsDetail && n.softwareLabelsDetail.length > 0;
            l.showBaseImageDetailsDialog(e.geoKey, n, i);
        };
        t.displayDeployImage = function (n) {
            k.showDeployServerDialog(e.geoKey, n);
        };
        t.manageTags = function (n) {
            b.showManageTagsDialog(e.geoKey, n.id, n.appName, h.tagAssetTypes.CUSTOMER_IMAGE);
        };
        t.displayEditImage = function (n) {
            l.showEditClientImageDialog(e.geoKey, n);
        };
        t.displayReconfigureImage = function (n) {
            l.showReconfigureImageDialog(e.geoKey, n);
        };
        t.displayDeleteConfirmation = function (n) {
            l.showDeleteClientImageDialog(e.geoKey, n);
        };
        t.displayCloneClientImage = function (n) {
            l.showCopyClientImageDialog(e.geoKey, n);
        };
        t.displayExportClientImage = function (n) {
            l.showExportClientImageDialog(e.geoKey, n);
        };
        t.displayMoveClientImageAnotherCluster = function (n) {
            l.showMoveClientImageAnotherClusterDialog(e.geoKey, n);
        };
        t.removeFailedImage = function (t) {
            l.removeFailedCustomImages(e.geoKey, t.id, function () {
                n.$broadcast(h.events.imageApplicationActionRequested, { action: h.imageApplicationActions.removeFailedClientImage, geoKey: e.geoKey, id: t.id, name: t.appName, image: t });
            });
        };
        t.importAsClientImage = function (n) {
            l.showImportOvfPackageDialog(e.geoKey, n);
        };
        t.getClientImageActionInProgressDescription = function (n) {
            return !!n && !!n.step ? c.ClientImageActionInProgress.replace("{0}", n.step.number).replace("{1}", n.numberOfSteps).replace("{2}", n.step.percentComplete).replace("{3}", n.step.name) : "";
        };
        t.getGeo = function (n) {
            return _.findWhere(t.availableGeos, { geoKey: n });
        };
        t.isClientImageInProgress = function (n) {
            return t.isClientImageActionFailed(n) ? !1 : !!n && !!n.progress && n.state.toLowerCase().indexOf("failed") === -1 && n.state.toLowerCase().indexOf("requires_support") === -1;
        };
        t.isClientImageActionFailed = function (n) {
            return (
                !!n &&
                ((!!n.state && (n.state.toLowerCase().indexOf("failed") === 0 || n.state.toLowerCase().indexOf("requires_support") === 0)) ||
                    (!!n.progress && n.progress.action === h.customerImagesAction.DELETE_SERVER_IMAGE && !!n.progress.failureReason))
            );
        };
        t.getProgressActionString = function (n) {
            return ut(n);
        };
        t.isImageActionInProgress = function (n) {
            if (n.progress)
                switch (n.progress.action) {
                    case h.customerImagesAction.COPY_IMAGE:
                    case h.customerImagesAction.COPY_CUSTOMER_IMAGE:
                    case h.customerImagesAction.RECONFIGURE_IMAGE:
                    case h.customerImagesAction.DELETE_SERVER_IMAGE:
                        return !0;
                    default:
                        return !1;
                }
            return !1;
        };
        t.filterModel = { isWindowsChecked: null, isUnixChecked: null };
        t.filterQuery = {
            showStandardImage: null,
            showPricedSoftware: null,
            showClientImage: !0,
            showLongTermRetentionSnapshotImage: null,
            osCustomization: null,
            family: null,
            version: null,
            pricedSoftwares: null,
            datacenters: null,
            searchText: null,
        };
        t.resetFilters = function (n) {
            t.filterQuery = {
                showStandardImage: null,
                showPricedSoftware: null,
                showClientImage: null,
                showLongTermRetentionSnapshotImage: null,
                osCustomization: null,
                family: null,
                version: null,
                pricedSoftwares: null,
                datacenters: null,
                searchText: null,
            };
            _.each(t.windowsImageVersions, function (n) {
                n.ischecked = !1;
            });
            _.each(t.linuxImageVersions, function (n) {
                n.ischecked = !1;
            });
            _.each(t.softwareLabels, function (n) {
                n.ischecked = !1;
            });
            _.each(t.datacenters, function (n) {
                n.ischecked = !1;
            });
            t.filterModel = { isWindowsChecked: null, isUnixChecked: null };
            t.osCusotmization = { with: !1, without: !1 };
            t.imageType = { standard: !1, priced: !1, client: !1 };
            t.searchText = "";
            n && (t.loadFilteredImages(), window.history.pushState({}, document.location.pathName, "#/" + e.geoKey + "/"));
        };
        it = function () {
            angular.element("[kendo-grid]").each(function (n, t) {
                var i = angular.element(t).data();
                for (mData in i) angular.isObject(i[mData]) && "destroy" in i[mData] && i[mData].destroy();
            });
        };
        t.toggleImageView = function (n) {
            t.isListView != n && ((t.isListView = n), it(), t.loadFilteredImages());
        };
        t.showFilters = !1;
        t.isUnixChecked = !1;
        t.isWindowsChecked = !1;
        t.showImageTypes = !0;
        t.showOsCustomization = !0;
        t.showOsTypes = !0;
        t.showPriced = !0;
        t.updateFilter = function (n, i) {
            t.view = "AppStoreItems";
            d.updateFilter(n, i, t.filterQuery, t.windowsImageVersions, t.linuxImageVersions, t.filterModel);
            t.loadFilteredImages();
        };
        t.sortImages = function (n) {
            t.dataSource.sort({ field: n, dir: "asc" });
        };
        t.isListView = !1;
        t.setDisabledTooltipStringsForLTRImages = function () {
            var r = '<a href="https://docs.mcp-services.net/x/4QByAQ" target="_blank"> ' + c.IntroToCloudServerSnapshotLongTermRetention + "</a>",
                n = c.ForMoreInformationReferToX.replace("{0}", r),
                i = '<div class="tooltip-wrapper"><span>{0}</span></div>';
            t.copyImageDisabledForLTRImageTooltip = i.replace("{0}", c.LTRImageCannotBeCopiedToAnotherDatacenter + " " + n);
            t.moveImageDisabledForLTRImageTooltip = i.replace("{0}", c.LTRImageCannotBeMovedToAnotherCluster + " " + n);
            t.exportImageDisabledForLTRImageTooltip = i.replace("{0}", c.LTRImageCannotBeExported + " " + n);
        };
        t.getImagesGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    cache: !1,
                    read: function (n) {
                        var i = $("#imagesGrid"),
                            r = i.data("kendoGrid");
                        kendo.ui.progress(i, !0);
                        l.filterImages(
                            e.geoKey,
                            t.filterQuery,
                            function (t) {
                                tt(t);
                                n.success(t);
                                kendo.ui.progress(i, !1);
                            },
                            n.error
                        );
                    },
                },
                pageSize: h.gridPageSize,
                scrollable: !1,
                requestStart: function () {
                    t.isLoading = !0;
                },
                requestEnd: function () {
                    t.isLoading = !1;
                },
            },
            pageable: h.defaultGridPageable,
            sortable: !0,
            filterable: !0,
            noRecords: !0,
            messages: { loading: c.Loading, requestFailed: c.ServerListLoadError, retry: c.Retry, noRecords: c.MsgNoRecords },
            columns: [
                { field: "appName", title: c.ImageNameTitle, template: "<div ng-include=\"'ImageNameColumnTemplate'\"></div>", sortable: !0, filterable: !0 },
                { title: c.DatacentersTitle, template: "<div ng-include=\"'ImageDatacenterColumnTemplate'\"></div>", filterable: !1 },
                { title: "", template: "<div ng-include=\"'ImageMenuTemplate'\"></div>", headerTemplate: "<div ng-include=\"'RefreshButtonGridHeaderTemplate'\"></div>", width: "55px", filterable: !1, sortable: !1 },
            ],
        };
        t.getScsiControllerDiskTotalStorage = function (n) {
            return _.reduce(
                _.pluck(n.disk, "sizeGb"),
                function (n, t) {
                    return n + t;
                },
                0
            );
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.BaseImageDetailsController", [
    "$rootScope",
    "$scope",
    "CaaS.Common.Constants",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.DeployServerService",
    "CaaS.Services.DataCenterService",
    "CaaS.Services.OperatingSystemService",
    function (n, t, i, r, u, f, e) {
        t.GetosImageAdvSettingValues = function (n) {
            return n ? _.findWhere(i.osImageAdvSettingValues, { id: n }).name : "";
        };
        t.GetosImageAdvSettingkeys = function (n) {
            return n &&
                _.filter(i.osImageAdvSettingKeys, function (t) {
                    return t.id.toLowerCase() === n.toLowerCase();
                }).length > 0
                ? _.filter(i.osImageAdvSettingKeys, function (t) {
                      return t.id.toLowerCase() === n.toLowerCase();
                  })[0].name
                : "";
        };
        t.main = function () {
            t.image = t.params.image;
            t.geoKey = t.params.geoKey;
            t.isPricedSoftware = t.params.isPricedSoftware;
            t.dataCenterClusters = [];
            t.isProcessing = !0;
            f.getDatacenters(t.geoKey, function (n) {
                _.each(t.image.datcenterClusters, function (i) {
                    var r = _.findWhere(n, { location: i.value.datacenterId });
                    !!r && r.networking.type === 2 && !!r.hypervisor.cluster && r.hypervisor.cluster.length > 1 && !!i.value.clusterName
                        ? t.dataCenterClusters.push(i.value.datacenterId + ": " + i.value.clusterName)
                        : t.dataCenterClusters.push(i.value.datacenterId);
                });
                t.isProcessing = !1;
            });
        };
        t.isNgocImage = function (n) {
            return !!n && !!n.guest && n.guest.osCustomization;
        };
        t.getDataCenterClusterList = function (n) {
            return _.map(n.datcenterClusters, function (n) {
                return n.value.datacenterId + ", " + n.value.clusterName;
            });
        };
        t.getUsageElement = function (n) {
            return e.getUsageElementForImage(n);
        };
        t.deployImage = function () {
            t.closeDialog();
            u.showDeployServerDialog(t.geoKey, t.image);
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.ClientImageDetailsController", [
    "$rootScope",
    "$scope",
    "CaaS.Services.ApplicationsService",
    "CaaS.Common.Strings",
    "CaaS.Common.Constants",
    "CaaS.Services.TagsService",
    "CaaS.Services.DeployServerService",
    "CaaS.Services.DataCenterService",
    "CaaS.Services.UserSessionService",
    "CaaS.Services.OperatingSystemService",
    function (n, t, i, r, u, f, e, o, s, h) {
        t.isClientImageCopyingNotAllowed = !1;
        t.isClientImageExportingNotAllowed = !1;
        t.expiryTime = null;
        t.copyImageDisabledForLTRImageTooltip = "";
        t.moveImageDisabledForLTRImageTooltip = "";
        t.exportImageDisabledForLTRImageTooltip = "";
        t.GetosImageAdvSettingValues = function (n) {
            return n ? _.findWhere(u.osImageAdvSettingValues, { id: n }).name : "";
        };
        t.GetosImageAdvSettingkeys = function (n) {
            return n &&
                _.filter(u.osImageAdvSettingKeys, function (t) {
                    return t.id.toLowerCase() === n.toLowerCase();
                }).length > 0
                ? _.filter(u.osImageAdvSettingKeys, function (t) {
                      return t.id.toLowerCase() === n.toLowerCase();
                  })[0].name
                : "";
        };
        t.main = function () {
            if (
                ((t.image = t.params.image),
                (t.geoKey = t.params.geoKey),
                (t.clientImagesInProgress = t.params.clientImagesInProgress),
                (t.isClientImageCopyingNotAllowed = t.params.isClientImageCopyingNotAllowed),
                (t.isClientImageExportingNotAllowed = t.params.isClientImageExportingNotAllowed),
                (t.isMcp2Datacenter = t.params.isMcp2Datacenter),
                t.setDisabledTooltipStringsForLTRImages(),
                (t.isFailedClientImage = !!t.image && !!t.image.state && t.image.state.toLowerCase().indexOf("failed") === 0),
                (t.isNormalClientImage = !!t.image && !!t.image.state && t.image.state.toLowerCase().indexOf("failed") === -1 && t.image.state.toLowerCase().indexOf("requires_support") === -1 && !t.image.progress),
                (t.dataCenterClusters = []),
                (t.isProcessing = !0),
                o.getDatacenters(t.geoKey, function (n) {
                    _.each(t.image.datcenterClusters, function (i) {
                        var r = _.findWhere(n, { location: i.value.datacenterId });
                        !!r && r.networking.type === 2 && !!r.hypervisor.cluster && r.hypervisor.cluster.length > 1 && !!i.value.clusterName
                            ? t.dataCenterClusters.push(i.value.datacenterId + ": " + i.value.clusterName)
                            : t.dataCenterClusters.push(i.value.datacenterId);
                    });
                    t.isProcessing = !1;
                }),
                f.getTagsForTheAsset(
                    t.geoKey,
                    u.tagAssetTypes.CUSTOMER_IMAGE,
                    [t.image.id],
                    function (n) {
                        t.image.tags = n;
                        t.isProcessing = !1;
                    },
                    function () {
                        t.isProcessing = !1;
                    }
                ),
                t.image.expiryTime)
            ) {
                var n = t.getGeoTimeZone(s.homeGeo.geoKey);
                t.expiryTime = {
                    utcExpiryTime: t.formatUtcDateTime(t.image.expiryTime),
                    region: { timeZone: n, expiryTime: t.formatDateTime(t.image.expiryTime, n), expiryTimeTooltip: r.RegionTime + ": {{expiryTime.region.expiryTime}} ({{expiryTime.region.timeZone}})" },
                };
            }
        };
        t.getGeoTimeZone = function (n) {
            var t = _.findWhere(s.allGeos, { geoKey: n });
            if (t) return t.timeZone;
        };
        t.setDisabledTooltipStringsForLTRImages = function () {
            var u = '<a href="https://docs.mcp-services.net/x/4QByAQ" target="_blank"> ' + r.IntroToCloudServerSnapshotLongTermRetention + "</a>",
                n = r.ForMoreInformationReferToX.replace("{0}", u),
                i = '<div class="tooltip-wrapper"><span>{0}</span></div>';
            t.copyImageDisabledForLTRImageTooltip = i.replace("{0}", r.LTRImageCannotBeCopiedToAnotherDatacenter + " " + n);
            t.moveImageDisabledForLTRImageTooltip = i.replace("{0}", r.LTRImageCannotBeMovedToAnotherCluster + " " + n);
            t.exportImageDisabledForLTRImageTooltip = i.replace("{0}", r.LTRImageCannotBeExported + " " + n);
        };
        t.getImageVirtualHardwareStatus = function (n) {
            return !n.virtualHardware ? "" : n.virtualHardware.upToDate ? r.UpToDate : r.OutOfDate;
        };
        t.getUtcExpiryTimeDisplayValue = function () {
            return !!t.expiryTime && !!t.expiryTime.utcExpiryTime ? t.expiryTime.utcExpiryTime : r.NotApplicable;
        };
        t.isNgocImage = function (n) {
            return !!n && !!n.guest && n.guest.osCustomization;
        };
        t.getDataCenterList = function (n) {
            return _.map(n.dataCenterIds, _.iteratee("key"));
        };
        t.displayDeployImage = function () {
            t.closeDialog();
            e.showDeployServerDialog(t.geoKey, t.image);
        };
        t.displayCloneClientImage = function () {
            t.closeDialog();
            i.showCopyClientImageDialog(t.geoKey, t.image);
        };
        t.displayEditImage = function () {
            t.closeDialog();
            i.showEditClientImageDialog(t.geoKey, t.image);
        };
        t.displayReconfigureImage = function () {
            t.closeDialog();
            i.showReconfigureImageDialog(t.geoKey, t.image);
        };
        t.displayExportClientImage = function () {
            t.closeDialog();
            i.showExportClientImageDialog(t.geoKey, t.image);
        };
        t.displayDeleteConfirmation = function () {
            t.closeDialog();
            i.showDeleteClientImageDialog(t.geoKey, t.image);
        };
        t.displayMoveClientImageAnotherCluster = function () {
            t.closeDialog();
            i.showMoveClientImageAnotherClusterDialog(t.geoKey, t.image);
        };
        t.manageTags = function (n) {
            t.closeDialog();
            f.showManageTagsDialog(t.geoKey, n.id, n.appName, u.tagAssetTypes.CUSTOMER_IMAGE);
        };
        t.formatDateTime = function (n, t) {
            return n && t ? moment(n).tz(t).format(u.dateTimeDisplay) : r.NotApplicable;
        };
        t.formatUtcDateTime = function (n) {
            return n ? moment.utc(n).format(u.dateTimeDisplay) + " (" + r.UTC + ")" : r.NotApplicable;
        };
        t.getUsageElement = function (n) {
            return h.getUsageElementForImage(n);
        };
        t.removeFailedImage = function () {
            i.removeFailedCustomImages(
                t.geoKey,
                t.image.id,
                function () {
                    t.closeDialog();
                    n.$broadcast(u.events.imageApplicationActionRequested, { action: u.imageApplicationActions.removeFailedClientImage, geoKey: t.geoKey, id: t.image.id, name: t.image.appName, image: t.image });
                },
                function () {
                    t.closeDialog();
                }
            );
        };
    },
]);
app = angular.module("Platform.Plugin.Apps").component("clientImageExportHistory", {
    template: $("#ImageExportHistoryTemplate").html(),
    controllerAs: "$ctrl",
    bindings: {},
    controller: [
        "$filter",
        "CaaS.Common.Constants",
        "CaaS.Common.Strings",
        "CaaS.Services.ApplicationsService",
        "CaaS.Services.UserSessionService",
        "CaaS.Common.Utilities",
        "CaaS.Services.ServerStorageService",
        function (n, t, i, r, u, f, e) {
            var o = this,
                s;
            o.isLoading = !1;
            o.isAuthorized = !0;
            o.view = "";
            s = function (t) {
                if (!u.checkRole("CreateImage")) {
                    o.isAuthorized = !1;
                    o.view = "NoAccess";
                    return;
                }
                o.exportDataSource.transport.read = function (u) {
                    r.getCustomImageExportHistory(t, function (t) {
                        _.each(t, function (t) {
                            t.resultText = t.responseCode === "OK" ? i.Success : i.Error;
                            t.startDateText = t.startTime != null ? n("date")(t.startTime, "mediumDate") + ", " + n("date")(t.startTime, "shortTime") : "";
                            t.endDateText = t.endTime != null ? n("date")(t.endTime, "mediumDate") + ", " + n("date")(t.endTime, "shortTime") : "";
                            t.expiryDateText = !!t.success && !!t.success.outputFile && t.success.outputFile.length > 0 ? n("date")(t.success.outputFile[0].expiryTime, "mediumDate") : "";
                            t.nicAdapters = _.pluck(t.imageSummary.nic, "networkAdapter").join(",");
                            t.nicKeys = _.pluck(t.imageSummary.nic, "key").join(",");
                            t.imageSummary.totalStorage = e.getServerTotalDiskStorage(t.imageSummary);
                            t.imageSummary.totalDisk = e.getServerTotalDiskCount(t.imageSummary);
                            _.each(t.imageSummary.scsiController, function (n) {
                                n.adapterType = f.toTitleCase(n.adapterType.replace(/_/g, " "));
                            });
                            t.imageSummary.ideController = !t.imageSummary.ideController ? [] : _.sortBy(t.imageSummary.ideController, "channel");
                            t.imageSummary.sataController = !t.imageSummary.sataController ? [] : _.sortBy(t.imageSummary.sataController, "busNumber");
                            t.imageSummary.floppy = !t.imageSummary.floppy ? [] : _.sortBy(t.imageSummary.floppy, "driveNumber");
                        });
                        u.success(t);
                        o.view = "ExportGrid";
                    });
                };
                o.refresh(o.exportDataSource, 50);
            };
            o.refresh = function (n, t) {
                n.data([]);
                var i = !0;
                t && t !== n.pageSize() && (n.pageSize(t), (i = !1));
                n.page() !== 1 && (n.page(1), (i = !1));
                i && n.read();
            };
            o.exportGridOptions = {
                pageable: !1,
                sortable: !0,
                filterable: t.defaultGridFilterable,
                columns: [
                    { field: "resultText", title: "&nbsp;", width: "42px", attributes: { style: "text-overflow: clip" }, template: "<span ng-include=\"'ExportHistoryResultColumnTemplate'\"></span>", values: [i.Success, i.Error] },
                    { field: "imageSummary.name", width: "25%", title: i.Name, template: "<span ng-include=\"'ExportHistoryNameColumnTemplate'\"></span>" },
                    { field: "imageSummary.datacenterId", width: "25%", title: i.Datacenter },
                    { field: "ovfPackagePrefix", title: i.Files, width: "50%", template: "<div ng-include=\"'ExportHistoryFilesColumnTemplate'\"></div>" },
                    { field: "expiryDateText", width: "130px", title: i.ExpiresOn, template: "#= expiryDateText #" },
                ],
            };
            o.exportDataSource = new kendo.data.DataSource({
                transport: {
                    cache: !1,
                    read: function (n) {
                        n.success([]);
                    },
                },
                pageSize: 20,
                requestStart: function () {
                    o.isLoading = !0;
                },
                requestEnd: function () {
                    o.isLoading = !1;
                },
            });
            o.getTemplateById = function (n) {
                return $("#" + n).html();
            };
            o.$onInit = function () {
                u.onGeosLoaded(function () {
                    s(u.selectedGeo.geoKey);
                });
            };
        },
    ],
});
app = angular.module("Platform.Plugin.Apps").controller("Caas.Applications.ClientImageExportHistoryController", [
    "$scope",
    "$state",
    "$transitions",
    "CaaS.Common.Constants",
    "CaaS.Services.UserSessionService",
    function (n, t, i, r, u) {
        i.onSuccess({}, function () {
            u.onGeosLoaded(function () {
                t.go("exportHistory", { geoKey: u.selectedGeo.geoKey }, "replace");
            });
        });
        n.$on(r.events.selectedGeoChanged, function () {
            t.go("exportHistory", { geoKey: u.selectedGeo.geoKey });
        });
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.CopyClientImageController", [
    "$rootScope",
    "$scope",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.DataCenterService",
    "CaaS.Common.Strings",
    "CaaS.Common.Constants",
    "CaaS.Services.ServerStorageService",
    function (n, t, i, r, u, f, e) {
        t.sourceImageDetailInfo = "";
        t.ovfPackagePrefixRegex = f.ovfPackagePrefixRegex;
        t.targetLocationImageNames = [];
        t.tagsToApply = [];
        t.datacenterClusters = [];
        t.selectedDatacenter = null;
        t.isConfigurationSupported = !0;
        t.isMCP1DataCenterSelectedForNgoc = !1;
        t.pageLoaded = !1;
        t.main = function () {
            t.isProcessing = !0;
            t.image = t.params.image;
            t.geoKey = t.params.geoKey;
            t.copyClientImageInfoMessage = u.CopyClientImageInfoMessage;
            t.sourceImageDetailInfo = u.CopyClientImageSourceDetailHelpMessage.replace("{0}", t.image.appName).replace("{1}", t.image.dataCenterIds[0].key);
            t.isCopyToFtpAccount = !1;
            t.targetImageName = t.image.appName;
            r.getDatacenters(t.geoKey, function (n) {
                t.datacenters = !n ? [] : _.without(n, _.findWhere(n, { location: t.image.dataCenterIds[0].key }));
                t.isProcessing = !1;
                t.pageLoaded = !0;
            });
        };
        t.onDatacenterChange = function () {
            if (!!t.selectedDatacenter) {
                t.datacenterClusters = t.selectedDatacenter.hypervisor.cluster;
                t.isConfigurationSupported = !0;
                t.isMCP1DataCenterSelectedForNgoc = !1;
                t.selectedDatacenter.networking.type !== 1 || t.image.guest.osCustomization || (t.isMCP1DataCenterSelectedForNgoc = !0);
                t.image.totalStorageGb > t.selectedDatacenter.hypervisor.properties.maxTotalImageStorageGb && (t.isConfigurationSupported = !1);
                var n = e.getStorageControllerDisks(t.image);
                t.isConfigurationSupported &&
                    t.selectedDatacenter.hypervisor.cluster.length > 1 &&
                    t.selectedDatacenter.networking.type === 2 &&
                    ((t.isConfigurationSupported = !1),
                    _.each(t.selectedDatacenter.hypervisor.cluster, function (i) {
                        if (!t.isConfigurationSupported) {
                            var r = !0;
                            _.each(n, function (n) {
                                r = r && !!i.properties && !!i.properties.minDiskSizeGb && n.sizeGb >= i.properties.minDiskSizeGb && !!i.properties.maxDiskSizeGb && n.sizeGb <= i.properties.maxDiskSizeGb;
                            });
                            r && (t.isConfigurationSupported = !0);
                        }
                    }));
                t.isConfigurationSupported &&
                    (t.selectedDatacenter.networking.type === 1 || (t.selectedDatacenter.networking.type === 2 && t.selectedDatacenter.hypervisor.cluster.length === 0)) &&
                    ((t.isConfigurationSupported = !1),
                    (t.isConfigurationSupported = _.every(n, function (n) {
                        return (
                            !!t.selectedDatacenter.hypervisor.properties.minDiskSizeGb &&
                            n.sizeGb >= t.selectedDatacenter.hypervisor.properties.minDiskSizeGb &&
                            !!t.selectedDatacenter.hypervisor.properties.maxDiskSizeGb &&
                            n.sizeGb <= t.selectedDatacenter.hypervisor.properties.maxDiskSizeGb
                        );
                    })));
            }
        };
        t.submit = function (r) {
            ((t.isSubmitting = !0), r && r.$invalid) ||
                ((t.isProcessing = !0),
                i.copyCustomImageToDataCenter(
                    t.geoKey,
                    { sourceImageId: t.image.id, targetImageName: t.targetImageName, targetImageDescription: t.targetImageDes, datacenterId: t.selectedDatacenter.location, ovfPackagePrefix: t.ovfPackagePrefix, tagById: t.tagsToApply },
                    function () {
                        t.closeDialog();
                        n.$broadcast(f.events.imageApplicationActionRequested, {
                            action: f.imageApplicationActions.copyClientImage,
                            geoKey: t.geoKey,
                            id: t.image.id,
                            sourceImageLocation: t.image.dataCenterIds[0].key,
                            targetImageName: t.targetImageName,
                            datacenterId: t.selectedDatacenter.location,
                        });
                    },
                    function (n) {
                        if (!!n && !!n.errorCode && n.errorCode === "REASON_391") {
                            t.targetLocationImageNames.push(t.targetImageName);
                            r.name.$setValidity("caasNotInArray", !1);
                            t.isProcessing = !1;
                            return;
                        }
                        t.closeDialog();
                    }
                ));
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.DeleteClientImageController", [
    "$rootScope",
    "$scope",
    "CaaS.Services.ApplicationsService",
    "CaaS.Common.Strings",
    "CaaS.Common.Constants",
    function (n, t, i, r, u) {
        t.confirmationMessage = "";
        t.main = function () {
            t.image = t.params.image;
            t.geoKey = t.params.geoKey;
            t.imageDataCenters = _.map(t.image.dataCenterIds, _.iteratee("key"));
            t.imageDataCenter = t.imageDataCenters.length > 0 ? t.imageDataCenters[0] : null;
            t.dialogTitle = t.image.longTermRetentionImage ? r.DeleteLongTermRetentionImageTitle : r.DeleteClientImageTitle;
            t.imageTypeDescription = t.image.longTermRetentionImage ? r.DeleteImageTypeLongTermRetention : r.DeleteImageTypeClient;
            t.confirmationMessage = r.ClientImageDeleteConfirmationMessage.replace("{0}", t.imageTypeDescription).replace("{1}", t.image.appName).replace("{2}", t.imageDataCenter);
        };
        t.submit = function (r) {
            ((t.isSubmitting = !0), r && r.$invalid) ||
                ((t.isProcessing = !0),
                i.deleteCustomImage(
                    t.geoKey,
                    t.image.id,
                    function () {
                        t.closeDialog();
                        var i = t.image.longTermRetentionImage ? u.imageApplicationActions.removeLongTermRetentionImage : u.imageApplicationActions.removeClientImage;
                        n.$broadcast(u.events.imageApplicationActionRequested, { action: i, geoKey: t.geoKey, id: t.image.id, name: t.image.appName, image: t.image });
                    },
                    function () {
                        t.closeDialog();
                    }
                ));
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.DeployServerController", [
    "$rootScope",
    "$scope",
    "$timeout",
    "CaaS.Common.Constants",
    "CaaS.Common.Strings",
    "CaaS.Services.ServerService",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.SubnetCalculationService",
    "CaaS.Services.NetworkService",
    "CaaS.Services.NetworkDomainService",
    "CaaS.Services.DataCenterService",
    "CaaS.Common.Utilities",
    "CaaS.Services.UIService",
    function (n, t, i, r, u, f, e, o, s, h, c, l) {
        function rt(i, u, f, e) {
            n.$broadcast(r.events.serverActionRequested, { action: r.serverActions.createServer, name: e.serverName });
            t.closeDialog();
        }
        function ut(i, u, f, e) {
            n.$broadcast(r.events.serverActionFailed, { action: r.serverActions.createServer, name: e.serverName, error: i });
            t.isProcessing = !1;
        }
        var v, b, y, a, k, g, w;
        t.serverName = "";
        t.nicTypes = [];
        t.model = {
            cpuCount: 0,
            cpu: { count: 0, coresPerSocket: 0, speed: "" },
            memory: 0,
            disks: [],
            datacenter: null,
            network: null,
            networkDomain: null,
            datacenterIsMcp2: null,
            servers: [{ name: "", vlan: null, network: null, ipAddress: "", id: 1, secondaryNics: [] }],
            serverDescription: "",
            serverPassword: "",
            serverConfirmPassword: "",
            nicType: "",
            gatewayIp: "",
            startServerOnDeploy: !1,
            postDeploymentScript: "",
        };
        t.currentMcp = null;
        t.selectedMcp = null;
        t.datacenters = [];
        t.allDatacenters = [];
        t.ipAddressPattern = r.ipv4Regex;
        t.selectedTab = null;
        t.vlans = [];
        v = 1;
        b = 1;
        t.serverDetailTabIndex = 0;
        t.microsoftTimeZones = r.microsoftTimeZones;
        t.serverPasswordLabel = u.ServerPrimaryPassword;
        t.passwordPlaceHolderText = u.AdministratorPasswordPlaceHolderText;
        t.passwordToolTip = u.Tooltip_DeployServerPassword;
        t.passwordPattern = r.serverPasswordRegex;
        t.focusElement = "";
        t.getTimeZone = function (n) {
            if (!!n) {
                var i = _.find(t.microsoftTimeZones, function (t) {
                    return t.index === n;
                });
                return i.name + "(" + i.time + ")";
            }
        };
        t.sliderOptions = {};
        t.tabs = [
            { id: 0, content: "serverDetail", active: !1, heading: { className: "fa fa-pencil-alt", title: u.ServerDetails }, focusElement: "networkDomain" },
            { id: 1, content: "serverSpec", active: !1, heading: { className: "fa fa-hdd", title: u.ServerSpec }, focusElement: "serverSpec" },
            { id: 2, content: "serverSummary", active: !1, heading: { className: "fa fa-check", title: u.Review } },
        ];
        t.tabIndex = 0;
        t.isNotDeployable = function (n) {
            return !t.image || (n && n.$invalid);
        };
        t.canSelectTab = function (n) {
            t.$broadcast("$validate");
            for (var i = 0; i < n.id; i++) if (t.tabs[i].form && t.tabs[i].form.$invalid) return !1;
            return !!t.image;
        };
        t.setTabSelected = function (n) {
            t.loaded = undefined;
            t.selectedTab = n;
            i(function () {
                t.loaded = {};
                t.focusElement = n.focusElement;
            }, 1e3);
        };
        t.getNextTab = function () {
            if (t.selectedTab.form && t.selectedTab.form.$invalid) {
                t.showErrors = !0;
                return;
            }
            t.$broadcast("$validate");
            t.tabIndex < t.tabs.length - 1 && ++t.tabIndex;
        };
        t.getPreviousTab = function () {
            t.tabIndex > 0 && --t.tabIndex;
        };
        t.numericOptions = { format: "#", decimals: 0 };
        t.addServer = function () {
            var n = t.model.servers[0];
            t.model.servers.push({ id: ++v, name: !n.name ? "" : n.name + "-" + v, vlan: n.vlan, network: n.network, ipAddress: "", availableIps: n.availableIps, baseIp: n.baseIp, secondaryNics: [] });
        };
        t.addSecondaryNic = function (n) {
            n.secondaryNics.push({ id: ++b, vlan: null, ipAddress: "" });
            t.focusElement = "secondaryNic";
        };
        t.removeServer = function (n) {
            t.model.servers = _.reject(t.model.servers, function (t) {
                return t.id === n.id;
            });
            t.focusElement = "description";
        };
        t.removeSecondaryNic = function (n, i) {
            n.secondaryNics = _.reject(n.secondaryNics, function (n) {
                return n.id === i.id;
            });
            t.focusElement = "description";
        };
        y = function () {
            t.vlans = [];
            _.each(t.model.servers, function (n) {
                n.ipAddress = "";
                n.vlan = null;
                n.vlanInProgressMessage = null;
                t.model.datacenter && t.model.datacenter.networking.type === 1
                    ? (n.secondaryNics = [])
                    : _.each(n.secondaryNics, function (n) {
                          n.ipAddress = "";
                          n.vlan = null;
                      });
            });
        };
        t.diskSpeedTooltip = "<div ng-repeat='diskSpeed in constraints.diskSpeeds'><strong>{{diskSpeed.displayName}}</strong><br /> {{diskSpeed.description}} <br /><br /></div>";
        t.cpuSpeedTooltip = "<div ng-repeat='cpuSpeed in constraints.cpuSpeeds'><strong>{{cpuSpeed.displayName}}</strong><br /> {{cpuSpeed.description}} <br /><br /></div>";
        t.vlanTooltip = "<span>" + u.Vlan + ": {{server.vlan.name}}</span>";
        t.secondaryVlanTooltip = "<span>" + u.Vlan + ": {{secondaryNic.vlan.name}}</span>";
        t.networkTooltip = "<span>{{server.network.name}}</span>";
        t.getTooltipMessage = function (n) {
            var i = "";
            switch (n) {
                case "RAM":
                    i = u.RamRangeTooltip.replace("{0}", t.constraints.minMemoryGb).replace("{1}", t.constraints.maxMemoryGb);
                    break;
                case "CPU":
                    i = u.CpuRangeTooltip.replace("{0}", t.constraints.minCpuCount).replace("{1}", t.constraints.maxCpuCount);
                    break;
                case "Cores":
                    i = u.CpuCoresRangeTooltip.replace("{0}", t.constraints.minCpuCores).replace("{1}", t.constraints.maxCpuCores);
                    break;
                default:
                    i = "";
            }
            return i;
        };
        t.ramRangeTooltip = "{{getTooltipMessage('RAM')}}";
        t.cpuRangeTooltip = "{{getTooltipMessage('CPU')}}";
        t.cpuCoresRangeTooltip = "{{getTooltipMessage('Cores')}}";
        t.anyVlanInNetworkDomain = !0;
        t.anyNetworkDomainInDc = !0;
        t.anyNetworkInDc = !0;
        t.vlanInProgressMessage = null;
        t.datacenterChanged = function () {
            t.model.datacenter &&
                ((t.isProcessing = !0),
                (t.diskloaded = undefined),
                y(),
                a(t.model.datacenter),
                (t.model.datacenterIsMcp2 = t.model.datacenter.networking.type === 2),
                c.getOperatingSystemDetails(t.geoKey, t.image.operatingSystem.id, function (n) {
                    var i = n;
                    !i ||
                        (t.nicTypes = _.map(i.networkAdapter, function (n) {
                            return n.name;
                        }));
                }),
                t.model.datacenter.networking.type === 1
                    ? s
                          .getNetworkList(t.geoKey, t.model.datacenter.location)
                          .then(function (n) {
                              t.networks = n.data;
                              t.anyNetworkInDc = n.data.length > 0;
                          })
                          .finally(function () {
                              t.isProcessing = !1;
                          })
                    : h
                          .getNetworkDomainList(t.geoKey, t.model.datacenter.location)
                          .then(function (n) {
                              t.networkDomains = n.data;
                              t.anyNetworkDomainInDc = n.data.length > 0;
                          })
                          .catch(function () {})
                          .finally(function () {
                              t.isProcessing = !1;
                          }),
                t.selectImage(t.image));
        };
        t.networkDomainChanged = function () {
            !t.model.networkDomain ||
                ((t.isProcessing = !0),
                y(),
                h
                    .getVlanListForNetworkDomain(t.geoKey, t.model.networkDomain.id)
                    .then(function (n) {
                        t.anyVlanInNetworkDomain = n.data.length > 0;
                        t.vlans = n.data;
                    })
                    .catch(function () {})
                    .finally(function () {
                        t.isProcessing = !1;
                    }));
        };
        t.getVlanList = function (n, i) {
            return _.filter(t.vlans, function (t) {
                var r = n.vlan === t,
                    u = _.any(n.secondaryNics, function (n) {
                        return n.vlan === t;
                    });
                return t == i || (!r && !u);
            });
        };
        t.vlanChanged = function (n) {
            var e = n.vlan && n.vlan.state !== r.states.normal,
                f,
                i;
            if (((n.vlanInProgressMessage = !e ? null : u.VlanOperationInProgressInfoMessage.replace("{0}", n.vlan.name)), !!e)) {
                n.vlan = null;
                return;
            }
            if (n.vlan) {
                if (
                    ((t.isProcessing = !0),
                    (n.ipAddress = ""),
                    (f = _.findIndex(t.vlans, function (t) {
                        return t.id === n.vlan.id;
                    })),
                    f < 0)
                ) {
                    t.isProcessing = !1;
                    return;
                }
                i = t.vlans[f];
                i && (!i.availableIps || i.availableIps.length === 0)
                    ? h
                          .getReservedPrivateIpv4Addresses(t.params.geoKey, i.id)
                          .then(function (n) {
                              t.vlans[f] = i;
                              i.availableIps = o.getAvailablePrivateIpAddresses(i.privateIpv4Range.address, i.privateIpv4Range.prefixSize, n.data, i.gatewayAddressing);
                              i.baseIp = o.getFixedPrivateIpAddressPrefix(i.privateIpv4Range.address, i.privateIpv4Range.prefixSize);
                          })
                          .catch(function () {
                              t.closeDialog();
                          })
                          .finally(function () {
                              t.isProcessing = !1;
                          })
                    : (t.isProcessing = !1);
            }
        };
        t.secondaryNicChanged = function (n, i) {
            var s = i.vlan && i.vlan.state !== r.states.normal,
                e,
                f;
            if (((n.vlanInProgressMessage = !s ? null : u.VlanOperationInProgressInfoMessage.replace("{0}", i.vlan.name)), !!s)) {
                i.vlan = null;
                return;
            }
            if (
                ((t.isProcessing = !0),
                (i.ipAddress = ""),
                (e = _.findIndex(t.vlans, function (n) {
                    return n.id === i.vlan.id;
                })),
                e < 0)
            ) {
                t.isProcessing = !1;
                return;
            }
            f = t.vlans[e];
            f && (!f.availableIps || f.availableIps.length === 0)
                ? h
                      .getReservedPrivateIpv4Addresses(t.params.geoKey, f.id)
                      .then(function (n) {
                          t.vlans[e] = f;
                          f.availableIps = o.getAvailablePrivateIpAddresses(f.privateIpv4Range.address, f.privateIpv4Range.prefixSize, n.data, f.gatewayAddressing);
                          f.baseIp = o.getFixedPrivateIpAddressPrefix(f.privateIpv4Range.address, f.privateIpv4Range.prefixSize);
                      })
                      .catch(function () {
                          t.closeDialog();
                      })
                      .finally(function () {
                          t.isProcessing = !1;
                      })
                : (t.isProcessing = !1);
        };
        t.getAvailableIps = function (n, i, r) {
            return (
                r || (t.model.datacenter && t.model.datacenter.networking.type === 1 && !!n.network ? (r = n.network.availableIps) : t.model.datacenter && t.model.datacenter.networking.type === 2 && !!n.vlan && (r = n.vlan.availableIps)),
                _.filter(r, function (n) {
                    return n == i
                        ? !0
                        : !_.any(t.model.servers, function (t) {
                              var i = n == t.ipAddress,
                                  r = _.any(t.secondaryNics, function (t) {
                                      return n == t.ipAddress;
                                  });
                              return i || r;
                          });
                })
            );
        };
        t.getBaseIp = function (n) {
            return t.model.datacenter && t.model.datacenter.networking.type === 1 && !!n.network ? n.network.baseIp : t.model.datacenter && t.model.datacenter.networking.type === 2 && !!n.vlan ? n.vlan.baseIp : "";
        };
        t.networkChanged = function (n) {
            if (((t.isProcessing = !0), (n.ipAddress = ""), !n.network)) {
                t.isProcessing = !1;
                return;
            }
            var i = _.findIndex(t.networks, function (t) {
                return t.id === n.network.id;
            });
            if (i < 0) {
                t.isProcessing = !1;
                return;
            }
            t.networks[i] && !t.networks[i].availableIps
                ? s
                      .getNetworkConfigurations(t.geoKey, t.networks[i].id)
                      .then(function (n) {
                          t.networks[i].availableIps = s.getAvailablePrivateIps(n.data.privateNet, n.data.privateIps.ips);
                          t.networks[i].baseIp = o.getFixedPrivateIpAddressPrefix(n.data.privateNet, 24);
                      })
                      .catch(function () {
                          t.closeDialog();
                      })
                      .finally(function () {
                          t.isProcessing = !1;
                      })
                : ((t.isProcessing = !1), (n.availableIps = t.networks[i].availableIps), (n.baseIp = o.getFixedPrivateIpAddressPrefix(t.networks[i].availableIps[0], 24)));
        };
        t.assignDefaultIp = function (n) {
            if (n.ipAddress === "" || !n.ipAddress) {
                var i = t.getAvailableIps(n);
                i.length > 0 && (!!t.model.datacenter && t.model.datacenter.networking.type === 1 && n.network ? (n.ipAddress = i[0]) : !!t.model.datacenter && t.model.datacenter.networking.type === 2 && n.vlan && (n.ipAddress = i[0]));
            }
        };
        t.assignSecondaryNicDefaultIp = function (n, i) {
            if (i.ipAddress === "" && !!i.vlan) {
                var r = t.getAvailableIps(n, null, i.vlan.availableIps);
                r.length > 0 && !!t.model.datacenter && t.model.datacenter.networking.type === 2 && i.vlan && (i.ipAddress = r[0]);
            }
        };
        t.changeToPrimaryNic = function (n, i) {
            if (!!t.model.datacenter && t.model.datacenter.networking.type === 2 && i.vlan) {
                var r = n.vlan,
                    u = n.ipAddress;
                n.vlan = i.vlan;
                n.ipAddress = i.ipAddress;
                i.vlan = r;
                i.ipAddress = u;
                t.focusElement = "description";
            }
        };
        t.isDataceneterPreselected = !1;
        t.showErrors = !1;
        t.isProcessing = !1;
        t.constraints = { minDiskSizeGb: 0, maxDiskSizeGb: 0, diskSpeeds: [], maxCpuCount: 0, maxMemoryGb: 0, minMemoryGb: 0 };
        t.disk = { sizeGb: 0, speed: null };
        t.operatingSystem = {};
        t.numberOfSockets = function () {
            var n = t.model.cpu.count > 0 ? t.model.cpu.count / t.model.cpu.coresPerSocket : 0;
            return u.Lablel_NoOfSockets.replace("{0}", n);
        };
        t.isNetworkDomain = function () {
            return !!t.model.datacenter && t.model.datacenter.networking.type === 2;
        };
        t.cpuCountChanged = function () {
            var n = l.getFactors(t.model.cpu.count);
            n.length <= 0 && n.push(1);
            t.model.cpu.coresPerSocket = n[0];
            t.constraints.cpuCores = n;
        };
        t.$watch("model.cpu.count", t.cpuCountChanged);
        a = function (n) {
            t.constraints.minDiskSizeGb = parseInt(n.hypervisor.properties.minDiskSizeGb);
            t.constraints.maxDiskSizeGb = parseInt(n.hypervisor.properties.maxDiskSizeGb);
            t.constraints.totalAdditionalStorageGb = parseInt(n.hypervisor.properties.maxTotalStorageGb);
            t.constraints.diskSpeeds = n.hypervisor.diskSpeed;
            t.constraints.cpuSpeeds = n.hypervisor.cpuSpeed;
            var i = _.find(t.constraints.cpuSpeeds, { default: !0 });
            t.model.cpuSpeed = i.id;
            t.constraints.minCpuCount = 1;
            t.constraints.maxCpuCount = n.hypervisor.properties.maxCpuCount;
            t.constraints.maxMemoryGb = parseInt(n.hypervisor.properties.maxMemoryGb);
            t.constraints.minMemoryGb = parseInt(n.hypervisor.properties.minMemoryGb);
            t.constraints.maxCpuCores = 8;
            t.model.coresPerSocket = 1;
            t.diskloaded = {};
        };
        t.imagesList = [
            { name: u.All, value: "", group: u.All, type: "" },
            { name: "Windows Server 2012", value: "win2012", group: u.StandardWindowsImages, type: r.operatingSystemTypes.Windows },
            { name: "Windows Server 2008", value: "win2008", group: u.StandardWindowsImages, type: r.operatingSystemTypes.Windows },
            { name: "Ubuntu", value: "ubuntu", group: u.StandardLinuxImages, type: r.operatingSystemTypes.Unix },
            { name: "CentOS", value: "centos", group: u.StandardLinuxImages, type: r.operatingSystemTypes.Unix },
            { name: "RedHat", value: "redhat", group: u.StandardLinuxImages, type: r.operatingSystemTypes.Unix },
            { name: "SuSE", value: "suse", group: u.StandardLinuxImages, type: r.operatingSystemTypes.Unix },
            { name: u.All, value: "All", group: u.ClientImages, type: "" },
            { name: u.WindowsImages, value: "", group: u.ClientImages, type: r.operatingSystemTypes.Windows },
            { name: u.LinuxImages, value: "", group: u.ClientImages, type: r.operatingSystemTypes.Unix },
        ];
        k = function () {
            e.getSoftwareLabels(t.geoKey, function (n) {
                _.each(n, function (n) {
                    t.imagesList.push({ name: n.displayName, value: n.id, type: u.PricedSoftware, group: u.PricedSoftware });
                });
            });
        };
        t.isImageSelectSubmitting = !1;
        var d = function (n) {
                var i, r;
                !t.model.datacenter || ((i = _.filter(t.image.dataCenterIds, { key: t.model.datacenter.location })), (t.model.datacenter.imageId = i && i.length > 0 ? i[0].value : null));
                t.selectedAppStoreItem = n;
                t.model.imageType = n.imageType;
                t.model.cpu.count = n.cpu.count;
                t.model.cpu.coresPerSocket = n.cpu.coresPerSocket;
                t.model.cpu.speed = n.cpu.speed;
                t.constraints.minCpuCount = 1;
                t.model.memory = n.memoryGb;
                t.model.disks = [];
                _.each(n.disks, function (n) {
                    t.model.disks.push({ sizeGb: n.sizeGb, defaultSize: n.sizeGb, speed: n.speed, scsiId: n.scsiId });
                });
                t.isSoftwareLabel = !!n.softwareLabelsDetail && n.softwareLabelsDetail.length > 0;
                t.model.startServerOnDeploy = t.isSoftwareLabel;
                r = !t.image.operatingSystem ? "" : t.image.operatingSystem.id.toUpperCase();
                t.serverPasswordRequired = !(t.image.imageType === "custom" && (t.image.vendor === "UNIX" || r.startsWith("WIN2003")));
                t.serverPasswordLabel = t.image.vendor === "WINDOWS" ? u.ServerPrimaryPassword : u.ServerRootPassword;
                t.passwordPlaceHolderText = t.image.vendor === "WINDOWS" ? u.AdministratorPasswordPlaceHolderText : u.RootPasswordPlaceHolderText;
            },
            nt = function () {
                s.getNetworkList(t.geoKey, t.model.datacenter.location)
                    .then(function (n) {
                        t.networks = n.data;
                        t.anyNetworkInDc = n.data.length > 0;
                        var i = _.find(t.networks, { id: t.params.networkId });
                        t.model.servers[0].network = i;
                        t.networkChanged(t.model.servers[0]);
                    })
                    .finally(function () {
                        t.isProcessing = !1;
                    });
            },
            tt = function () {
                h.getNetworkDomainList(t.geoKey, t.model.datacenter.location)
                    .then(function (n) {
                        t.networkDomains = n.data;
                        t.anyNetworkDomainInDc = n.data.length > 0;
                        var i = _.find(t.networkDomains, { id: t.params.networkId });
                        !i ||
                            ((t.model.networkDomain = i),
                            h
                                .getVlanListForNetworkDomain(t.geoKey, t.model.networkDomain.id)
                                .then(function (n) {
                                    t.vlans = n.data;
                                    t.anyVlanInNetworkDomain = n.data.length > 0;
                                })
                                .catch(function () {})
                                .finally(function () {}));
                    })
                    .catch(function () {})
                    .finally(function () {});
            },
            it = function (n) {
                t.model.datacenter = n;
                a(t.model.datacenter);
                t.model.datacenterIsMcp2 = t.model.datacenter.networking.type === 2;
                t.model.datacenterIsMcp2 ? tt() : nt();
            },
            p = function (n) {
                t.loadAllImages();
                c.getDatacenters(t.geoKey, function (i) {
                    t.datacenters = i;
                    var r = _.find(i, { location: n });
                    r ? it(r) : (t.isProcessing = !1);
                });
            };
        t.customizeImageSelected = function () {
            t.tabIndex++;
        };
        g = function () {
            _.each(t.tabs, function (n) {
                ++n.id;
            });
            t.tabs.splice(0, 0, { id: 0, content: "selectImage", active: !1, heading: { className: "fa fa-pencil-alt", title: u.SelectImage }, focusElement: "operatingSystem" });
        };
        t.main = function () {
            t.isProcessing = !0;
            t.params.image
                ? ((t.image = t.params.image),
                  (t.geoKey = t.params.geoKey),
                  d(t.image),
                  (t.currentMcp = t.params.geoKey),
                  (t.selectedMcp = t.params.geoKey),
                  (t.isProcessing = !0),
                  c.getDatacenters(t.geoKey, function (n) {
                      t.networkDomains = n;
                      _.each(t.image.dataCenterIds, function (i) {
                          var r = _.where(n, { location: i.key });
                          r[0].imageId = i.value;
                          t.datacenters.push(r[0]);
                      });
                      a(t.datacenters[0]);
                      t.isProcessing = !1;
                  }))
                : ((t.geoKey = t.params.geoKey),
                  g(),
                  k(),
                  (t.serverDetailTabIndex = 1),
                  (t.networkId = t.params.networkId),
                  (t.isDataceneterPreselected = t.params.networkType !== 0 || !!t.params.datacenterId),
                  t.params.networkType === 2
                      ? h.getNetworkDomainDetails(t.geoKey, t.params.networkId, function (n) {
                            var t = n.dataCenter.location;
                            p(t);
                        })
                      : t.params.networkType === 1
                      ? s.getNetworkDetails(t.geoKey, t.params.networkId, function (n) {
                            var t = n.network.location;
                            p(t);
                        })
                      : (t.params.networkType && t.params.networkType !== 0) || p(!t.params.datacenterId ? "" : t.params.datacenterId));
        };
        t.submit = function () {
            var n, r;
            if (
                (t.$broadcast("$validate"),
                (n = _.find(t.tabs, function (n) {
                    return n.form && n.form.$invalid;
                })),
                n)
            ) {
                t.showErrors = !0;
                t.tabIndex = n.id;
                r = angular.element("[name='" + n.form.$name + "']").find(".ng-invalid:first");
                r.length > 0 &&
                    i(function () {
                        r[0].focus();
                    });
                return;
            }
            t.isProcessing = !0;
            _.each(t.model.servers, function (n, r) {
                i(function () {
                    var r = [],
                        i;
                    _.each(n.secondaryNics, function (n) {
                        r.push({ PrivateIpv4: n.ipAddress, vlanId: n.vlan.id, networkAdapter: t.model.nicType });
                    });
                    i = {
                        name: n.name,
                        cpuCount: t.model.cpuCount,
                        cpu: t.model.cpu,
                        memory: t.model.memory,
                        description: t.model.serverDescription,
                        imageId: t.model.datacenter.imageId,
                        imageType: t.model.imageType,
                        start: t.model.startServerOnDeploy,
                        password: t.serverPasswordRequired ? t.model.serverPassword : "",
                        networkType: t.model.datacenter.networking.type === 1 ? "MCP1_0" : "MCP2_0",
                        networkInfo: t.model.datacenter.networking.type === 1 ? { networkId: n.network.id, privateIpv4: n.ipAddress } : null,
                        networkDomainInfo:
                            t.model.datacenter.networking.type === 2 ? { networkDomainId: t.model.networkDomain.id, primaryNic: { privateIpv4: n.ipAddress, vlanId: n.vlan.id, networkAdapter: t.model.nicType }, additionalNic: r } : null,
                        disks: t.model.disks,
                        primaryDns: t.model.primaryDns,
                        secondaryDns: t.model.secondaryDns,
                        microsoftTimeZone: t.model.serverTimeZone,
                        ipv4Gateway: t.model.ipv4Gateway,
                        postDeploymentScript: t.model.postDeploymentScript,
                    };
                    f.deployServer(t.geoKey, i, rt, ut, { handleAllStatusCodes: !0, serverName: i.name });
                }, 1500 * r);
            });
        };
        t.listViewOptions = { selectable: "multiple" };
        t.dataSource = new kendo.data.DataSource({
            transport: {
                cache: !1,
                read: function (n) {
                    n.success([]);
                },
            },
            pageSize: 10,
            requestStart: function () {
                t.isLoading = !0;
                t.isProcessing = !0;
            },
            requestEnd: function () {
                t.isLoading = !1;
                t.isProcessing = !1;
            },
        });
        t.selectImage = function (n) {
            (n.state && n.state !== "NORMAL") ||
                (!t.image || (t.image.selected = !1),
                (n.selected = !0),
                (t.image = n),
                d(t.image),
                t.isDataceneterPreselected &&
                    c.getOperatingSystemDetails(t.geoKey, t.image.operatingSystem.id, function (n) {
                        var i = n;
                        !i ||
                            (t.nicTypes = _.map(i.networkAdapter, function (n) {
                                return n.name;
                            }));
                    }));
        };
        t.loadAllImages = function (n, i, r) {
            t.dataSource.transport.read = function (u) {
                e.getImages(t.geoKey, r, null, i, n, function (n) {
                    u.success(n);
                });
            };
            t.refresh();
        };
        w = function (n, i, f, o) {
            t.dataSource.transport.read = function (s) {
                switch (n) {
                    case u.ClientImages:
                        e.getCustomImages(t.geoKey, i, o, "", function (n) {
                            s.success(_.where(n, { state: r.states.normal }));
                        });
                        break;
                    case u.PricedSoftware:
                        e.getPricedImages(t.geoKey, f, "", o, function (n) {
                            s.success(n);
                        });
                        break;
                    case u.All:
                    case u.StandardWindowsImages:
                    case u.StandardLinuxImages:
                        e.getImages(t.geoKey, i, f, o, "", function (n) {
                            s.success(n);
                        });
                        break;
                    default:
                        e.searchImages(t.geoKey, o, "", function (n) {
                            s.success(n);
                        });
                }
            };
            t.refresh();
        };
        t.updateImageList = function (n) {
            var i = n.type,
                r = n.value,
                u = n.group;
            w(u, i, r, "");
            t.searchText = "";
        };
        t.searchImages = function (n, t) {
            var i = !t || t.group === u.All ? "" : t.type,
                r = !t || t.group === u.All ? "" : t.value,
                f = !t || t.group === u.All ? "" : t.group;
            w(f, i, r, n);
        };
        t.refresh = function () {
            t.dataSource.page(1);
            t.dataSource.data([]);
            t.dataSource.read();
        };
        t.handleSearchKeyPress = function (n, i, r) {
            n.which === 13 && t.searchImages(i, r);
        };
        t.getDataCenterList = function (n) {
            return _.map(n.dataCenterIds, _.iteratee("key")).join(", ");
        };
        t.showDeployVlan = function () {
            t.closeDialog();
            !t.model.datacenter.networking || t.model.datacenter.networking.type !== 2 || h.showAddVlanDialog(t.geoKey, t.model.datacenter.location, t.model.networkDomain.id);
        };
        t.showAddNetwork = function () {
            t.closeDialog();
            s.showAddNetworkDialog(t.geoKey, t.model.datacenter.location);
        };
        t.getClientImageActionInProgressDescription = function (n) {
            return u.ClientImageActionInProgress.replace("{0}", n.step.number).replace("{1}", n.numberOfSteps).replace("{2}", n.step.percentComplete).replace("{3}", n.step.name);
        };
        t.isClientImageInProgress = function (n) {
            return !!n && !!n.progress && n.progress.numberOfSteps !== 0 && n.state.toLowerCase().indexOf("failed") === -1;
        };
        t.isClientImageActionFailed = function (n) {
            return !!n && !!n.state && n.state.toLowerCase().indexOf("failed") === 0;
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.EditClientImageController", [
    "$rootScope",
    "$scope",
    "$q",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.DataCenterService",
    "CaaS.Common.Strings",
    "CaaS.Common.Constants",
    "CaaS.Common.Utilities",
    function (n, t, i, r, u, f, e) {
        var h;
        t.operatingSystems = null;
        t.cpuSpeeds = [];
        t.diskSpeeds = [];
        t.isAnyCpuSpeedNotAvailable = !0;
        t.isAnyDiskSpeedNotAvailable = !1;
        t.cpuSpeed;
        t.restoreDateRegex = e.restoreDateRegex;
        t.selectedExpiryTime = null;
        t.isExpiryTimeSpecified = !1;
        t.earliestSettableExpiryTime = moment.utc(new Date()).add(1, "d").format();
        t.isInvalidExpiryTime = !1;
        t.expiryTimeError = "";
        t.main = function () {
            var n, r;
            t.isProcessing = !0;
            t.image = angular.copy(t.params.image);
            t.geoKey = t.params.geoKey;
            !t.image.expiryTime || ((t.isExpiryTimeSpecified = !0), (t.selectedExpiryTime = moment.utc(t.image.expiryTime).format("DD-MM-YYYY")));
            t.model = { operatingSystem: null };
            n = [
                { field: "Family", operator: "eq", value: t.image.guest.operatingSystem.family },
                { field: "OsUnitsGroupId", operator: "eq", value: t.image.guest.operatingSystem.osUnitsGroupId },
            ];
            !t.image.guest.osCustomization || n.push({ field: "SupportsGuestOsCustomization", operator: "eq", value: !0 });
            r = [
                u.getDatacenter(t.params.geoKey, t.image.dataCenterIds[0].key, function (n) {
                    if (
                        ((t.cpuSpeeds = n.hypervisor.cpuSpeed),
                        (t.diskSpeeds = _.filter(n.hypervisor.diskSpeed, function (n) {
                            return !!n.available;
                        })),
                        !!n.hypervisor.cluster && !!n.hypervisor.cluster.length && !!t.image.cluster)
                    ) {
                        var i = _.find(n.hypervisor.cluster, { id: t.image.cluster.id });
                        !i ||
                            ((t.cpuSpeeds = i.cpuSpeed),
                            (t.diskSpeeds = _.filter(i.diskSpeed, function (n) {
                                return !!n.available;
                            })));
                    }
                    t.isMcp2 = n.networking.type === 2;
                    t.cpuSpeed = t.image.cpu.speed;
                    h = n;
                    c(n);
                    o(t.image.scsiController, t.diskSpeeds);
                    o(t.image.sataController, t.diskSpeeds);
                    o(t.image.ideController, t.diskSpeeds);
                }),
                u.getDatacenterOperationSystems(t.params.geoKey, n, function (n) {
                    t.operatingSystems = n;
                    t.model.operatingSystem = _.find(t.operatingSystems, { id: t.image.guest.operatingSystem.id.toUpperCase() });
                }),
            ];
            i.all(r).then(
                function () {
                    t.isProcessing = !1;
                },
                function () {
                    t.isProcessing = !1;
                }
            );
        };
        var o = function (n, i) {
                return (
                    _.each(_.pluck(n, "disk"), function (n) {
                        _.each(n, function (n) {
                            var f = _.find(i, function (t) {
                                    return t.id === n.speed && !!t.available;
                                }),
                                r,
                                u;
                            f
                                ? ((n.diskSpeed = f),
                                  (n.variableIops = f.variableIops),
                                  !n.variableIops ||
                                      ((r = f.variableIopLimits),
                                      (u = n.sizeGb),
                                      (n.minIops = r.minIopsPerGb * u > r.minDiskIops ? r.minIopsPerGb * u : r.minDiskIops),
                                      (n.maxIops = r.maxIopsPerGb * u < r.maxDiskIops ? r.maxIopsPerGb * u : r.maxDiskIops)))
                                : (t.isAnyDiskSpeedNotAvailable = !0);
                        });
                    }),
                    !0
                );
            },
            c = function (n) {
                var r = n.hypervisor.cpuSpeed,
                    u = n.hypervisor.diskSpeed,
                    i;
                !n.hypervisor.cluster || !n.hypervisor.cluster.length || !t.image.cluster || ((i = _.find(n.hypervisor.cluster, { id: t.image.cluster.id })), (r = i.cpuSpeed), (u = i.diskSpeed));
                t.isAnyCpuSpeedNotAvailable = _.some(r, function (n) {
                    return t.image.cpu.speed === n.id && !!n.available;
                });
            },
            s = function (n, t) {
                var i = !0;
                return (
                    _.each(_.pluck(n, "disk"), function (n) {
                        _.each(n, function (n) {
                            !n.variableIops || (!!n.variableIops && n.iops >= n.minIops && n.iops <= n.maxIops) ? t.push({ id: n.id, speed: n.speed, iops: !n.iops ? null : n.iops }) : (i = !1);
                        });
                    }),
                    i
                );
            };
        t.validateSelectedExpiryDate = function () {
            if (((t.expiryTimeError = ""), t.isExpiryTimeSpecified))
                if (t.selectedExpiryTime === null) t.expiryTimeError = f.CustomerImageDateFormatError;
                else {
                    var n = moment.utc(t.selectedExpiryTime, "DD-MM-YYYY");
                    n.isValid() || (t.expiryTimeError = f.CustomerImageDateFormatError);
                }
        };
        t.submit = function (i) {
            var o, u, f;
            if (((t.isAnyDiskIopsError = !1), (t.isSubmitting = !0), t.isAnyCpuSpeedNotAvailable && !t.isAnyDiskSpeedNotAvailable) && ((o = _.findWhere(t.cpuSpeeds, { id: t.image.cpu.speed })), o || !t.isMcp2)) {
                if (((u = []), !s(t.image.scsiController, u) || !s(t.image.sataController, u) || !s(t.image.ideController, u))) {
                    t.isAnyDiskIopsError = !0;
                    return;
                }
                (t.validateSelectedExpiryDate(), t.expiryTimeError === "") &&
                    ((i && i.$invalid) ||
                        ((f = { id: t.image.id, description: t.image.description, operatingSystemId: t.model.operatingSystem.id, disk: u }),
                        (f.expiryTime = t.isExpiryTimeSpecified ? moment.utc(t.selectedExpiryTime, "DD-MM-YYYY").endOf("day").format() : null),
                        t.isMcp2 && (f.cpuSpeed = o.id),
                        (t.isProcessing = !0),
                        r.editCustomImage(
                            t.geoKey,
                            f,
                            function () {
                                t.closeDialog();
                                n.$broadcast(e.events.imageApplicationActionCompleted, { action: e.imageApplicationActions.editClientImage, geoKey: t.geoKey, id: t.image.id, imageName: t.image.appName });
                            },
                            function () {
                                t.isProcessing = !1;
                            }
                        )));
            }
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.ExportClientImageController", [
    "$rootScope",
    "$scope",
    "$q",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.DataCenterService",
    "CaaS.Common.Strings",
    "CaaS.Common.Constants",
    function (n, t, i, r, u, f, e) {
        t.sourceImageDetailInfo = "";
        t.imagesTreeByDataCenters = [];
        t.imageToExport = null;
        t.ovfPackagePrefixRegex = e.ovfPackagePrefixRegex;
        t.ovfPackageNames = [];
        t.main = function () {
            t.isProcessing = !0;
            t.image = t.params.image;
            t.geoKey = t.params.geoKey;
            t.ovfPackageName = t.image.appName.replace(" ", "");
            t.cpuSocketDetails =
                t.image.dataCenterNetworkingType === 2 ? f.XSocketsXCoreEach.replace("{0}", t.image.cpu.count > 0 ? t.image.cpu.count / t.image.cpu.coresPerSocket : 0).replace("{1}", t.image.cpu.coresPerSocket) : t.image.cpu.count;
            r.getOvfPackages(t.geoKey, function (n) {
                t.ovfPackageNames = _.map(n, function (n) {
                    return n.name.replace(".mf", "");
                });
                t.isProcessing = !1;
            });
        };
        t.submit = function (i) {
            ((t.isSubmitting = !0), i && i.$invalid) ||
                ((t.isProcessing = !0),
                r.exportCustomImage(
                    t.geoKey,
                    { imageId: t.image.id, ovfPackageName: t.ovfPackageName },
                    function () {
                        t.closeDialog();
                        n.$broadcast(e.events.imageApplicationActionRequested, { action: e.imageApplicationActions.exportClientImage, geoKey: t.geoKey, id: t.image.id, sourceImageName: t.image.appName, ovfPackageName: t.ovfPackageName });
                    },
                    function (n) {
                        if (!!n && !!n.errorCode && n.errorCode === "REASON_460") {
                            i.ovfPackage.$setValidity("caasNotInArray", !1);
                            t.isProcessing = !1;
                            return;
                        }
                        t.closeDialog();
                    }
                ));
        };
    },
]);
var app = angular.module("Platform.Plugin.Apps").component("ftpsOvfPackages", {
        template: $("#FtpsOvfPackagesTemplate").html(),
        controllerAs: "$ctrl",
        bindings: {},
        controller: [
            "$scope",
            "$q",
            "$stateParams",
            "CaaS.Common.Constants",
            "CaaS.Common.Strings",
            "CaaS.Services.ApplicationsService",
            "CaaS.Services.UserSessionService",
            "CaaS.Services.UIService",
            "CaaS.Services.JobMonitorService",
            function (n, t, i, r, u, f, e, o, s) {
                var h = this;
                h.geoKey = "";
                h.isLoading = !1;
                h.isAuthorized = !0;
                h.ovfPackageCanImport = !1;
                h.ovfPackageCanExport = !1;
                var c = function (n) {
                        if (!n.progress) return null;
                        switch (n.progress.action) {
                            case r.customerImagesAction.COPY_CUSTOMER_IMAGE:
                                return n.state === r.customerImagesState.PENDING_CHANGE || n.state === r.customerImagesState.PENDING_ADD ? u.Copying : null;
                            case r.customerImagesAction.DELETE_SERVER_IMAGE:
                                return u.Deleting;
                            default:
                                return null;
                        }
                    },
                    a = function (n) {
                        var t = _.findWhere(h.ovfDataSource.data(), { id: n.id });
                        !t || (!n.progress || (t.progress = n.progress), (t.actionInProgress = c(n)));
                    },
                    l = function (n) {
                        if (((h.geoKey = n), !e.checkRole("CreateImage"))) {
                            h.isAuthorized = !1;
                            return;
                        }
                        h.ovfDataSource.transport.read = function (i) {
                            var u = [f.getOvfPackages(n), f.getOvfPackageCopyingInProgress(n)];
                            t.all(u).then(function (t) {
                                var r = _.sortBy(_.union(t[0].data, t[1].data), "name");
                                i.success(r);
                                s.addOvfCopies(n, t[1].data);
                            });
                            u = [f.getCustomerImageImportsInProgress(n), f.getOvfPackageCopyingInProgress(n)];
                            t.all(u).then(function (n) {
                                h.ovfPackageCanImport = n[0].data.length < r.customerImageCapacities.maxConcurrentImports;
                                h.ovfPackageCanExport = n[1].data.length < r.customerImageCapacities.maxConcurrentOvfCopies;
                            });
                        };
                        h.refresh(h.ovfDataSource, 20);
                    };
                h.listViewOptions = { selectable: "multiple" };
                h.ovfDataSource = new kendo.data.DataSource({
                    transport: {
                        cache: !1,
                        read: function (n) {
                            n.success([]);
                        },
                    },
                    pageSize: 20,
                    requestStart: function () {
                        h.isLoading = !0;
                    },
                    requestEnd: function () {
                        h.isLoading = !1;
                    },
                });
                n.$on(r.events.jobStateChanged, function (n, t) {
                    if (t.action === r.imageApplicationActions.copyOvfPackageFromRemoteGeo) {
                        var i = _.findWhere(h.ovfDataSource.data(), { remoteCopyId: t.id });
                        i && ((i.status = t.status), (i.progress = t.progress));
                    }
                });
                h.refresh = function (n, t) {
                    s.removeAllItems();
                    n.data([]);
                    var i = !0;
                    t && t !== h.ovfDataSource.pageSize() && (n.pageSize(t), (i = !1));
                    n.page() !== 1 && (n.page(1), (i = !1));
                    i && n.read();
                };
                h.getTemplateById = function (n) {
                    return $("#" + n).html();
                };
                h.importAsClientImage = function (n) {
                    f.showImportOvfPackageDialog(h.geoKey, n);
                };
                h.exportToAnotherRegion = function (n) {
                    f.showCopyOvfPackageDialog(h.geoKey, n);
                };
                h.getOvfPackageDetails = function (n) {
                    n.progress || f.showOvfPackageDetailsDialog(h.geoKey, n, h.ovfPackageCanImport, h.ovfPackageCanExport);
                };
                h.getOvfPackageActionInProgressDescription = function (n) {
                    return u.OvfPackageActionInProgress.replace("{0}", n.step.number).replace("{1}", n.numberOfSteps).replace("{2}", n.step.name);
                };
                h.getOvfPackageGeoSourceName = function (n) {
                    return u.CopyingFrom.replace("{0}", n.charAt(0).toUpperCase() + n.slice(1));
                };
                h.$onInit = function () {
                    e.onGeosLoaded(function () {
                        l(e.selectedGeo.geoKey);
                    });
                };
            },
        ],
    }),
    app = angular.module("Platform.Plugin.Apps").controller("Caas.Applications.FtpsOvfPackagesController", [
        "$scope",
        "$state",
        "$transitions",
        "CaaS.Common.Constants",
        "CaaS.Services.UserSessionService",
        "CaaS.Services.UIService",
        function (n, t, i, r, u, f) {
            i.onSuccess({}, function () {
                u.onGeosLoaded(function () {
                    t.go("ovfPackages", { geoKey: u.selectedGeo.geoKey }, "replace");
                });
            });
            n.$on(r.events.selectedGeoChanged, function () {
                t.go("ovfPackages", { geoKey: u.selectedGeo.geoKey });
            });
            n.$on(r.events.regionActionCompleted, f.showEventNotification);
            n.$on(r.events.tagManagementActionCompleted, function (n, t) {
                f.showEventNotification(n, t);
            });
            n.$on(r.events.imageApplicationActionRequested, function (n, t) {
                f.showEventNotification(n, t);
            });
            n.$on(r.events.jobManagementActionRequested, function (n, t) {
                t.action === r.jobManagementActions.deployTemplate && f.showEventNotification(n, t);
            });
            n.$on(r.events.imageApplicationActionCompleted, function (n, t) {
                f.showEventNotification(n, t);
            });
        },
    ]),
    app = angular.module("Platform.Plugin.Apps").controller("Caas.Applications.IndexController", [
        "$scope",
        "$state",
        "$transitions",
        "CaaS.Common.Constants",
        "CaaS.Services.UserSessionService",
        function (n, t, i, r, u) {
            i.onSuccess({}, function () {
                u.onGeosLoaded(function () {
                    if (t.current.name === "none") {
                        t.go("list", { geoKey: u.selectedGeo.geoKey }, "replace").then(function () {
                            n.$broadcast(r.events.caasApplicationIndexControllerStateChangeSuccess, {});
                        });
                        return;
                    }
                    if (t.current.imageName) {
                        t.go("list", { geoKey: t.current.geoKey, imageName: t.current.imageName }, "replace").then(function () {
                            n.$broadcast(r.events.caasApplicationIndexControllerStateChangeSuccess, {});
                        });
                        return;
                    }
                    n.$broadcast(r.events.caasApplicationIndexControllerStateChangeSuccess, {});
                });
            });
            n.$on(r.events.selectedGeoChanged, function () {
                t.go("list", { geoKey: u.selectedGeo.geoKey });
            });
        },
    ]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.MoveCustomerImageController", [
    "$scope",
    "$rootScope",
    "CaaS.Common.Constants",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.DataCenterService",
    function (n, t, i, r, u) {
        n.geoKey = n.params.geoKey;
        n.image = n.params.image;
        n.isSubmitting = !1;
        n.isProcessing = !1;
        n.isTargetClusterCompatibale = !0;
        n.dcClusters = [];
        n.targetCluster = null;
        n.datacenterId = n.image.dataCenterIds[0].key;
        n.main = function () {
            n.isProcessing = !0;
            u.getDatacenter(
                n.geoKey,
                n.datacenterId,
                function (t) {
                    var i = t.hypervisor.cluster;
                    n.dcClusters = _.without(i, _.findWhere(i, { id: n.image.cluster.id }));
                    n.isProcessing = !1;
                },
                function () {
                    n.isProcessing = !1;
                }
            );
        };
        var f = function () {
            var i = _.some(n.targetCluster.cpuSpeed, function (t) {
                    return t.id === n.image.cpu.speed;
                }),
                t = !0;
            return (_.each(n.image.disks, function (i) {
                t =
                    t &&
                    _.some(n.targetCluster.diskSpeed, function (n) {
                        return n.id === i.speed;
                    }) &&
                    !!n.targetCluster.properties &&
                    !!n.targetCluster.properties.minDiskSizeGb &&
                    i.sizeGb >= n.targetCluster.properties.minDiskSizeGb &&
                    !!n.targetCluster.properties.maxDiskSizeGb &&
                    i.sizeGb <= n.targetCluster.properties.maxDiskSizeGb;
            }),
            i &&
                t &&
                !!n.targetCluster.properties &&
                !!n.targetCluster.properties.maxCpuCount &&
                n.image.cpu.count <= n.targetCluster.properties.maxCpuCount &&
                !!n.targetCluster.properties.minMemoryGb &&
                n.image.memoryGb >= n.targetCluster.properties.minMemoryGb &&
                !!n.targetCluster.properties.maxMemoryGb &&
                n.image.memoryGb <= n.targetCluster.properties.maxMemoryGb)
                ? !0
                : !1;
        };
        n.submit = function (u) {
            ((n.isSubmitting = !0), n.$broadcast("$validate"), u && u.$invalid) ||
                ((n.isProcessing = !0),
                r.moveCustomerImageAnotherCluster(
                    n.geoKey,
                    n.image.id,
                    '"' + n.targetCluster.id + '"',
                    function () {
                        n.closeDialog();
                        t.$broadcast(i.events.imageApplicationActionRequested, { action: i.imageApplicationActions.moveCustomerImage, geoKey: n.params.geoKey, id: n.image.id, name: n.image.appName, targetClusterId: n.targetCluster.id });
                    },
                    function () {
                        n.isProcessing = !1;
                    }
                ));
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.OvfPackageCopyController", [
    "$rootScope",
    "$scope",
    "CaaS.Common.Constants",
    "CaaS.Services.UserSessionService",
    "CaaS.Services.ApplicationsService",
    "CaaS.Services.DataCenterService",
    function (n, t, i, r, u) {
        t.isProcessing = !1;
        t.isSubmitting = !1;
        t.availableGeos = [];
        t.model = {};
        t.main = function () {
            t.model = { sourceGeoId: t.params.geoKey, ovfPackageName: t.params.ovfPackage.name, destinationGeoKey: null };
            t.isProcessing = !0;
            r.onGeosLoaded(function () {
                t.availableGeos = _.filter(r.availableGeos, function (n) {
                    return n.geoKey !== t.params.geoKey && n.id != undefined;
                });
                t.isProcessing = !1;
            });
        };
        t.submit = function (r) {
            ((t.isSubmitting = !0), t.$broadcast("$validate"), r && r.$invalid) ||
                ((t.isProcessing = !0),
                u.copyOvfPackageFromRemoteGeo(
                    t.model.destinationGeoKey,
                    t.model,
                    function () {
                        t.closeDialog();
                        n.$broadcast(i.events.imageApplicationActionRequested, { action: i.imageApplicationActions.copyOvfPackageFromRemoteGeo, name: t.model.ovfPackageName });
                    },
                    function () {
                        t.isProcessing = !1;
                    }
                ));
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.OvfPackageDetailsController", [
    "$scope",
    "$q",
    "CaaS.Common.Constants",
    "CaaS.Services.ApplicationsService",
    function (n, t, i, r) {
        n.isProcessing = !0;
        n.canImport = !1;
        n.canExport = !1;
        n.main = function () {
            n.geoKey = n.params.geoKey;
            n.ovfPackage = n.params.ovfPackage;
            n.canImport = n.params.ovfPackageCanImport;
            n.canExport = n.params.ovfPackageCanExport;
            n.isProcessing = !1;
        };
        n.importAsClientImage = function () {
            n.closeDialog();
            r.showImportOvfPackageDialog(n.geoKey, n.ovfPackage);
        };
        n.exportToAnotherRegion = function () {
            n.closeDialog();
            r.showCopyOvfPackageDialog(n.geoKey, n.ovfPackage);
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.OvfPackageImportController", [
    "$rootScope",
    "$scope",
    "CaaS.Common.Constants",
    "CaaS.Common.Strings",
    "CaaS.Services.DataCenterService",
    "CaaS.Services.ApplicationsService",
    function (n, t, i, r, u, f) {
        t.isProcessing = !1;
        t.isSubmitting = !1;
        t.imageNameRegex = i.imageNameRegex;
        t.availableDataCenters = [];
        t.datacenterClusters = [];
        t.selectedDatacenter = null;
        t.model = {};
        t.noneGuestOsCustomization = !1;
        t.tagsToApply = [];
        t.existingTags = [];
        t.pageLoaded = !1;
        t.main = function () {
            t.isProcessing = !0;
            u.getDatacenters(t.params.geoKey, function (n) {
                t.availableDataCenters = n;
                t.isProcessing = !1;
                t.pageLoaded = !0;
            });
            t.model = { ovfPackageName: t.params.ovfPackage.name, name: t.params.ovfPackage.name.replace(".mf", ""), description: "" };
        };
        t.onDatacenterChange = function () {
            if (!!t.selectedDatacenter)
                if (((t.datacenterClusters = t.selectedDatacenter.hypervisor.cluster), t.selectedDatacenter.networking.type === 1))
                    $("#divGuestOsCustom").kendoTooltip({ content: r.ImportNgocImageToMcp1DcWarningMessage }), (t.noneGuestOsCustomization = !1);
                else {
                    var n = $("#divGuestOsCustom").kendoTooltip().data("kendoTooltip");
                    n.destroy();
                }
        };
        t.submit = function (r) {
            ((t.isSubmitting = !0), t.$broadcast("$validate"), r && r.$invalid) ||
                ((t.isProcessing = !0),
                (t.model.dataCenterId = t.selectedDatacenter.location),
                (t.model.guestOsCustomization = !t.noneGuestOsCustomization),
                (t.model.tagById = t.tagsToApply),
                f.importCustomerImage(
                    t.params.geoKey,
                    t.model,
                    function () {
                        t.closeDialog();
                        n.$broadcast(i.events.imageApplicationActionRequested, { action: i.imageApplicationActions.importClientImage, name: t.model.name });
                    },
                    function () {
                        t.isProcessing = !1;
                    }
                ));
        };
    },
]);
angular.module("Platform.Plugin.Apps").controller("CaaS.Applications.ReconfigureImageController", [
    "$rootScope",
    "$scope",
    "CaaS.Services.ApplicationsService",
    "CaaS.Common.Strings",
    "CaaS.Common.Constants",
    function (n, t, i, r, u) {
        function f(n) {
            var i = t.constraints.osImageAdvSettingValues.filter(function (t) {
                return t.id === n;
            });
            return i[0].name;
        }
        t.constraints = { osImageAdvSettingValues: u.osImageAdvSettingValues };
        t.filterLatency = "NORMAL, HIGH";
        t.filterTrueFalse = "true, false";
        t.containsComparator = function (n, t) {
            return t.indexOf(n) > -1;
        };
        t.main = function () {
            t.image = angular.copy(t.params.image);
            t.geoKey = t.params.geoKey;
            t.disableSubmit = !0;
            t.unsupportedValue = !1;
            t.unsupportedValueWarning = !1;
            t.displayUnsupportedCpuLatencySensitivity = !1;
            t.displayCpuLatencySensitivityOption = "";
            t.avs = t.image.advancedVirtualizationSetting;
            t.nestedHardwareVirtualization = t.GetosImageAdvSettingValues("nestedHardwareVirtualization", t.avs);
            t.cpuLatencySensitivity = t.GetosImageAdvSettingValues("cpuLatencySensitivity", t.avs);
            t.numaAutosize = t.GetosImageAdvSettingValues("numaAutosize", t.avs);
            t.enableHostInfoToVmTools = t.GetosImageAdvSettingValues("enableHostInfoToVmTools", t.avs);
            t.cpuLatencySensitivity &&
                t.cpuLatencySensitivity !== "NORMAL" &&
                t.cpuLatencySensitivity !== "HIGH" &&
                ((t.unsupportedValue = !0),
                (t.unsupportedValueWarning = !0),
                (t.displayUnsupportedCpuLatencySensitivity = !0),
                (t.displayCpuLatencySensitivityOption = r.UnsupportedValue.replace("{0}", f(t.GetosImageAdvSettingValues("cpuLatencySensitivity", t.avs)))),
                (t.cpuLatencySensitivity = "unsupported"));
        };
        t.submit = function (r) {
            var f, e;
            if (((t.isSubmitting = !0), !t.unsupportedValueWarning) && (!r || !r.$invalid)) {
                if (
                    ((f = {}),
                    t.nestedHardwareVirtualization && t.GetosImageAdvSettingValues("nestedHardwareVirtualization", t.avs) != t.nestedHardwareVirtualization && (f.NestedHardwareVirtualization = t.nestedHardwareVirtualization),
                    t.cpuLatencySensitivity && t.GetosImageAdvSettingValues("cpuLatencySensitivity", t.avs) != t.cpuLatencySensitivity && (f.CpuLatencySensitivity = t.cpuLatencySensitivity),
                    t.numaAutosize && t.GetosImageAdvSettingValues("numaAutosize", t.avs) != t.numaAutosize && (f.NumaAutosize = t.numaAutosize),
                    t.enableHostInfoToVmTools && t.GetosImageAdvSettingValues("enableHostInfoToVmTools", t.avs) != t.enableHostInfoToVmTools && (f.EnableHostInfoToVmTools = t.enableHostInfoToVmTools),
                    angular.equals(f, {}))
                ) {
                    t.closeDialog();
                    return;
                }
                t.isProcessing = !0;
                e = { AdvancedVirtualizationSettings: f, ImageId: t.image.id };
                i.reconfigureImage(
                    t.geoKey,
                    e,
                    function () {
                        t.closeDialog();
                        n.$broadcast(u.events.imageApplicationActionRequested, { action: u.imageApplicationActions.reconfigureImage, geoKey: t.geoKey, id: t.image.id, imageName: t.image.appName });
                    },
                    function () {
                        t.isProcessing = !1;
                    }
                );
            }
        };
        t.GetosImageAdvSettingValues = function (n, t) {
            var i = _.find(t, function (t) {
                return t.name == n;
            });
            return i ? i.value.toString() : null;
        };
        t.changeOptionValue = function () {
            t.disableSubmit = !(t.nestedHardwareVirtualization || (t.cpuLatencySensitivity && t.cpuLatencySensitivity !== "unsupported") || t.numaAutosize || t.enableHostInfoToVmTools);
        };
        t.changeWarning = function () {
            t.unsupportedValueWarning = !1;
            t.changeOptionValue();
        };
    },
]);
