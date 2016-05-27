/*globals define */
/*jshint browser: true*/
/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Tue May 17 2016 11:25:46 GMT-0400 (EDT).
 */

define([
    'panels/EasyDAG/EasyDAGControl',
    'js/NodePropertyNames',
    'underscore'
], function (
    EasyDAGControl,
    nodePropertyNames,
    _
) {

    'use strict';

    var ArchEditorControl;

    ArchEditorControl = function (options) {
        EasyDAGControl.call(this, options);
    };

    _.extend(ArchEditorControl.prototype, EasyDAGControl.prototype);

    ArchEditorControl.prototype.TERRITORY_RULE = {children: 1};
    ArchEditorControl.prototype._getObjectDescriptor = function(id) {
        var desc = EasyDAGControl.prototype._getObjectDescriptor.call(this, id);

        // Filter attributes
        if (!desc.isConnection) {
            var allAttrs = desc.attributes,
                names = Object.keys(allAttrs),
                schema;

            desc.attributes = {};
            for (var i = names.length; i--;) {
                schema = this._client.getAttributeSchema(id, names[i]);
                if (names[i] === 'name' || schema.hasOwnProperty('argindex')) {
                    desc.attributes[names[i]] = allAttrs[names[i]];
                }
            }

            // Add layer type (base class's base class)
            desc.layerType = null;
            if (desc.baseName) {
                var node = this._client.getNode(id),
                    base = this._client.getNode(node.getMetaTypeId()),
                    layerType = this._client.getNode(base.getBaseId());

                if (layerType) {
                    desc.layerType = layerType.getAttribute(nodePropertyNames.Attributes.name);
                }
            }
        }
        return desc;
    };

    ArchEditorControl.prototype._getValidInitialNodes = function() {
        return this._client.getChildrenMeta(this._currentNodeId).items
            // For now, anything is possible!
            // FIXME
            .map(info => this._getAllDescendentIds(info.id))
            .reduce((prev, curr) => prev.concat(curr))
            // Filter all abstract nodes
            .filter(nodeId => {
                return !this._client.getNode(nodeId).isAbstract();
            })
            .map(id => this._getObjectDescriptor(id))
            .filter(obj => !obj.isConnection && obj.name !== 'Connection');
    };

    return ArchEditorControl;
});
