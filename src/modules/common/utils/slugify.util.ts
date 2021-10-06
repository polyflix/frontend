import * as urlSlug from "url-slug";

const improvedSlugify = (item: string) => urlSlug.convert(item);

export { improvedSlugify as slugify };
