/**
 * Component availability rules for a component model (PROD-2913): who may add the component to a
 * page, and where it may be placed. The rules only govern adding, moving to another zone and copying
 * a component. They never affect rendering, or a component that's already on a page.
 *
 * Read with `getModelAvailability` / `getAllModelAvailability`, write with `saveModelAvailability`.
 *
 * Writes are three-state, per group (`addableBy`, `allowedIn`):
 * - group left out (`undefined`) or `null`: the stored rules are kept;
 * - group set to an object: the stored rules are replaced;
 * - group set to an object whose lists are all empty: the rules are cleared, so no restriction applies.
 *
 * On a write, each target is resolved by its ID when that ID exists on the instance, and otherwise by
 * its portable name: a user by `emailAddress`, a team by `name`, a sitemap by `referenceName`
 * (case-insensitive), a page model by `name`, and a zone by `pageModelName` + `referenceName`. So
 * rules copied from another instance can be saved with the IDs left out. If any target can't be
 * resolved, the whole save is rejected (HTTP 400) with a list of them.
 *
 * Disabling a component (nobody can add it) is the model's own `isVisible` flag (`Model.isVisible`),
 * not part of this object.
 */
export class ModelAvailability {
    /** The component model's ID. */
    modelID?: number | null;
    /** The component model's reference name. Read-only: ignored on a write. */
    modelReferenceName?: string | null;
    /** Who can add the component. `null` on a read means anyone who can edit the page. */
    addableBy?: ModelAvailabilityAddableBy | null;
    /** Where the component can be added. `null` on a read means anywhere. */
    allowedIn?: ModelAvailabilityAllowedIn | null;
}

/**
 * Who can add the component. A user may add it when they hold FullControl (Administrators are always
 * allowed), hold a listed permission, are a listed user, or belong to a listed team.
 */
export class ModelAvailabilityAddableBy {
    /**
     * Permissions: `Administrator` (FullControl), `Manager` (Manage) and `Designer` (Design). These are
     * permissions, not role names: a role that holds the Design permission passes a `Designer` rule.
     * `Administrator` is implied whenever the group isn't empty.
     */
    permissions?: ModelAvailabilityPermission[] | null;
    users?: ModelAvailabilityUser[] | null;
    teams?: ModelAvailabilityTeam[] | null;
}

/** A permission an `addableBy` rule can list. */
export type ModelAvailabilityPermission =
    | "Administrator"
    | "Manager"
    | "Designer"
    // Any other string: tolerates permissions the API adds later.
    | (string & {});

export class ModelAvailabilityUser {
    /** The user's ID on this instance. Leave it out to match by `emailAddress`. */
    userID?: number | null;
    emailAddress?: string | null;
}

export class ModelAvailabilityTeam {
    /** The team's ID. Leave it out to match by `name` within the instance's organization. */
    teamID?: number | null;
    name?: string | null;
}

/**
 * Where the component can be added. The placement is allowed when the page's sitemap is allowed (no
 * sitemaps listed, or the sitemap of the page's top-level ancestor is listed) and its layout is
 * allowed (no page models or zones listed, or the page's page model is listed, which allows any of its
 * zones, or the target zone is listed).
 */
export class ModelAvailabilityAllowedIn {
    sitemaps?: ModelAvailabilitySitemap[] | null;
    pageModels?: ModelAvailabilityPageModel[] | null;
    zones?: ModelAvailabilityZone[] | null;
}

export class ModelAvailabilitySitemap {
    /** The sitemap's (digital channel's) ID. Leave it out to match by `referenceName`. */
    sitemapID?: number | null;
    referenceName?: string | null;
    /** The sitemap's display name. Not used to match. */
    name?: string | null;
}

export class ModelAvailabilityPageModel {
    /** The page model's (page template's) ID. Leave it out to match by `name`. */
    pageModelID?: number | null;
    name?: string | null;
}

export class ModelAvailabilityZone {
    /** The zone's ID. Leave it out to match by `pageModelName` + `referenceName`. */
    zoneID?: number | null;
    pageModelID?: number | null;
    pageModelName?: string | null;
    /** The zone's reference name. */
    referenceName?: string | null;
    /** The zone's display name. Not used to match. */
    name?: string | null;
}
